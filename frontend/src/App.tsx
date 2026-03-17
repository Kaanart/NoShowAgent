import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import Dialog from './components/ui/Dialog';
import Button from './components/ui/Button';
import patients3Weeks from './patients_3_weeks.json';
import './App.css';

interface Suggestion {
  id: string | number;
  name: string;
  distance: number;
  match_score: number;
  email?: string;
  available_date?: string;
  available_time?: string;
}

export interface Appointment {
  id: number;
  patient_name: string;
  age: number;
  past_no_shows: number;
  risk_score: number;
  appointment_date: string;
  appointment_time: string;
  scan_type: string;
  duration: number;
}

type RawPatientAppointment = {
  id: string;
  name: string;
  date: string;
  time: string;
  distance: number;
  historical_no_show_rate: number;
  duration?: number;
};

const rawAppointments = patients3Weeks as RawPatientAppointment[];
const scanTypes = ["Quick Scan", "Long Scan", "Standard MRI", "Contrast MRI"];

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
};

const deriveDurationById = (items: RawPatientAppointment[]): Record<string, number> => {
  const byDate: Record<string, RawPatientAppointment[]> = {};
  const durations: Record<string, number> = {};
  const gaps: number[] = [];

  items.forEach((item) => {
    if (!byDate[item.date]) {
      byDate[item.date] = [];
    }
    byDate[item.date].push(item);
  });

  Object.values(byDate).forEach((daily) => {
    const sorted = [...daily].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
    sorted.forEach((current, index) => {
      if (typeof current.duration === 'number' && current.duration > 0) {
        durations[current.id] = current.duration;
        return;
      }
      if (index < sorted.length - 1) {
        const gap = Math.max(15, toMinutes(sorted[index + 1].time) - toMinutes(current.time));
        gaps.push(gap);
        durations[current.id] = gap;
      }
    });
  });

  const defaultDuration = gaps.length > 0
    ? Math.round(gaps.reduce((sum, value) => sum + value, 0) / gaps.length)
    : 120;

  items.forEach((item) => {
    if (!durations[item.id]) {
      durations[item.id] = item.duration ?? defaultDuration;
    }
  });

  return durations;
};

const durationById = deriveDurationById(rawAppointments);

const getWeekStartIso = (isoDate: string): string => {
  const date = new Date(`${isoDate}T12:00:00Z`);
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : (1 - day);
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().split('T')[0];
};

const weeklyBuckets = rawAppointments.reduce<Record<string, Appointment[]>>((acc, item) => {
  const weekKey = getWeekStartIso(item.date);
  const numericId = Number(String(item.id).replace(/^P/, ''));
  const appointment: Appointment = {
    id: numericId,
    patient_name: item.name,
    age: 30 + (numericId % 40),
    past_no_shows: Math.round(item.historical_no_show_rate * 10),
    risk_score: Math.min(0.95, item.historical_no_show_rate * 20),
    appointment_date: item.date,
    appointment_time: item.time,
    scan_type: scanTypes[(numericId - 1) % scanTypes.length],
    duration: durationById[item.id],
  };

  if (!acc[weekKey]) {
    acc[weekKey] = [];
  }
  acc[weekKey].push(appointment);
  return acc;
}, {});

export const allAppointmentsByWeek: Appointment[][] = Object.keys(weeklyBuckets)
  .sort()
  .map((weekKey) => weeklyBuckets[weekKey].sort((a, b) => {
    if (a.appointment_date === b.appointment_date) {
      return toMinutes(a.appointment_time) - toMinutes(b.appointment_time);
    }
    return a.appointment_date.localeCompare(b.appointment_date);
  }));

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestedBackups, setSuggestedBackups] = useState<Suggestion[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [promoteError, setPromoteError] = useState<string | null>(null);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [promotingAppointmentId, setPromotingAppointmentId] = useState<number | null>(null);
  const [selectedBackupPatient, setSelectedBackupPatient] = useState<Suggestion | null>(null);
  const [notificationDraft, setNotificationDraft] = useState('');

  const appointments = allAppointmentsByWeek[weekOffset];

  const handlePromote = async (appointmentId: number) => {
    console.log(`Promoting patient to appointment ${appointmentId}`);
    setSelectedAppointmentId(appointmentId);
    setPromoteError(null);
    setSelectedBackupPatient(null);
    setNotificationDraft('');
    setSuggestedBackups([]);
    setIsLoadingBackups(true);
    setPromotingAppointmentId(appointmentId);
    setIsDialogOpen(true);
    
    try {
      const response = await fetch(`/promote/${appointmentId}`, {
        method: 'POST',
      });
      const data = await response.json();
      setIsLoadingBackups(false);
      setPromotingAppointmentId(null);
      if (!response.ok) {
        setSuggestedBackups([]);
        setPromoteError(data?.detail || 'Unable to fetch backup suggestions.');
        return;
      }
      if (data.status === 'success') {
        setSuggestedBackups(data.suggestions || []);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions", error);
      setIsLoadingBackups(false);
      setPromotingAppointmentId(null);
      setSuggestedBackups([]);
      setPromoteError('Unable to reach the backup service. Please try again.');
    }
  };

  const getAppointmentSlotText = () => {
    if (!selectedAppointmentId) return 'the available time';
    const slot = appointments.find((appt) => appt.id === selectedAppointmentId);
    if (!slot) return 'the available time';
    return `${slot.appointment_date} at ${slot.appointment_time}`;
  };

  const openDraftForPatient = (patient: Suggestion) => {
    setSelectedBackupPatient(patient);
    const slotText = getAppointmentSlotText();
    setNotificationDraft(
      `Hello ${patient.name},\n\nWe have an available MRI appointment slot on ${slotText}. If you would like to take this appointment time, please reply to confirm and we will schedule you.\n\nBest regards,\nMRI Scheduling Team`
    );
  };

  const sendNotification = () => {
    if (!selectedBackupPatient) return;
    console.log(`Sending notification to ${selectedBackupPatient.name} for slot ${selectedAppointmentId}`);
    setIsDialogOpen(false);
    setSelectedBackupPatient(null);
    setNotificationDraft('');
  };

  const closeDraft = () => {
    setSelectedBackupPatient(null);
    setNotificationDraft('');
  };
  
  const getWeekDateRange = () => {
    const today = new Date('2026-03-16T12:00:00Z'); // Week 1 in patients_3_weeks.json
    today.setDate(today.getDate() + (weekOffset * 7));
    const dayOfWeek = today.getDay();
    
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  const renderContent = () => {
    if (currentView === 'Dashboard') {
      return (
        <Dashboard 
          appointments={appointments} 
          onPromote={handlePromote} 
          promotingAppointmentId={promotingAppointmentId}
          onViewCalendar={() => setCurrentView('Schedule')}
        />
      );
    } else if (currentView === 'Schedule') {
      return (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Weekly Schedule</h2>
          <CalendarView appointments={appointments} onPromote={handlePromote} promotingAppointmentId={promotingAppointmentId} />
        </div>
      );
    }
    return <div>View Not Found</div>;
  };

  return (
    <div className="app-layout">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen} 
      />
      
      <main className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
               <Button variant="outline" size="sm" onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} disabled={weekOffset === 0}>
                  <span className="material-symbols-outlined">chevron_left</span>
                  Prev Week
               </Button>
               <h1 className="header-title" style={{ textAlign: 'center' }}>
                  MRI Lab Dashboard
                  <span style={{ fontSize: '0.9rem', color: '#5f6368', display: 'block', fontWeight: 'normal' }}>
                    {getWeekDateRange()}
                  </span>
               </h1>
               <Button variant="outline" size="sm" onClick={() => setWeekOffset(prev => Math.min(allAppointmentsByWeek.length - 1, prev + 1))} disabled={weekOffset === allAppointmentsByWeek.length - 1}>
                  Next Week
                  <span className="material-symbols-outlined">chevron_right</span>
               </Button>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>
        
        <div className="scrollable-area">
          {renderContent()}
        </div>
      </main>

      <Dialog 
        isOpen={isDialogOpen} 
        onClose={() => {
          setIsDialogOpen(false);
          closeDraft();
        }} 
        title={selectedBackupPatient ? `Email Draft for ${selectedBackupPatient.name}` : "Select Backup Patient"}
      >
        {!selectedBackupPatient ? (
          <>
            <p style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>
              Select a backup patient to auto-promote to appointment slot #{selectedAppointmentId}. Candidates are ordered by highest match score.
            </p>
            {isLoadingBackups && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 0.9rem', borderRadius: '8px', border: '1px solid #dbeafe', background: '#eff6ff', color: '#1d4ed8', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>hourglass_top</span>
                <span>Finding backup patients...</span>
              </div>
            )}
            {promoteError && (
              <p style={{ color: '#b91c1c', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                {promoteError}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {suggestedBackups.map(patient => (
                <div 
                  key={patient.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '1rem', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => openDraftForPatient(patient)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-dark)' }}>{patient.name} ({patient.id})</strong>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{patient.distance} miles away</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{patient.match_score}% Match</div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Click to Draft Email</span>
                  </div>
                </div>
              ))}
              {!isLoadingBackups && !promoteError && suggestedBackups.length === 0 && (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>No suitable backups found.</p>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Review and edit the draft below before sending.</p>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 0.875rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                <strong style={{ color: '#1f2937' }}>To:</strong> {selectedBackupPatient.email || `${selectedBackupPatient.name.replace(/\s+/g, '.').toLowerCase()}@mail-example.com`}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.35rem' }}>
                <strong style={{ color: '#1f2937' }}>Subject:</strong> MRI appointment slot available
              </div>
            </div>
            <textarea
              value={notificationDraft}
              onChange={(e) => setNotificationDraft(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                minHeight: '220px',
                maxHeight: '48vh',
                borderRadius: '10px',
                border: '1px solid #4f6af5',
                padding: '1rem 1.05rem',
                fontSize: '0.98rem',
                lineHeight: 1.55,
                color: '#334155',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
              <Button variant="outline" onClick={closeDraft}>Cancel</Button>
              <Button variant="primary" onClick={sendNotification}>Send Email</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default App;
