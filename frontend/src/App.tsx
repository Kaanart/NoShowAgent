import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import Dialog from './components/ui/Dialog';
import Button from './components/ui/Button';
import './App.css';

interface Suggestion {
  id: string;
  name: string;
  distance: number;
  match_score: number;
}

const generateAppointmentsForWeek = (weekStartDate: Date, startId: number): any[] => {
  const appointments = [];
  let currentId = startId;
  const patientNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"];
  const scanTypes = ["Quick Scan", "Long Scan", "Standard MRI", "Contrast MRI"];

  for (let dayOfWeek = 0; dayOfWeek < 5; dayOfWeek++) { // Mon-Fri
    const appointmentsPerDay = 6 + Math.floor(Math.random() * 5); // 6 to 10 appointments a day
    const currentDate = new Date(weekStartDate);
    currentDate.setDate(weekStartDate.getDate() + dayOfWeek);
    const dateStr = currentDate.toISOString().split('T')[0];

    for (let i = 0; i < appointmentsPerDay; i++) {
      const hour = 8 + i;
      const timeStr = `${hour.toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
      
      appointments.push({
        id: currentId++,
        patient_name: `${patientNames[currentId % patientNames.length]}, ${String.fromCharCode(65 + (currentId % 26))}.`,
        age: 20 + (currentId % 65),
        past_no_shows: Math.floor(Math.random() * 5),
        risk_score: parseFloat(Math.random().toFixed(2)),
        appointment_date: dateStr,
        appointment_time: timeStr,
        scan_type: scanTypes[currentId % scanTypes.length],
        duration: Math.random() > 0.5 ? 60 : 30,
      });
    }
  }
  return appointments;
};

const week1Appointments = generateAppointmentsForWeek(new Date('2026-03-23T12:00:00Z'), 1);
const week2Appointments = generateAppointmentsForWeek(new Date('2026-03-30T12:00:00Z'), 101);
const week3Appointments = generateAppointmentsForWeek(new Date('2026-04-06T12:00:00Z'), 201);

const allAppointmentsByWeek = [week1Appointments, week2Appointments, week3Appointments];

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestedBackups, setSuggestedBackups] = useState<Suggestion[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const appointments = allAppointmentsByWeek[weekOffset];

  const handlePromote = async (appointmentId: number) => {
    console.log(`Promoting patient to appointment ${appointmentId}`);
    setSelectedAppointmentId(appointmentId);
    
    try {
      const response = await fetch(`/promote/${appointmentId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSuggestedBackups(data.suggestions || []);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions", error);
    }
  };

  const confirmPromotion = (patient: Suggestion) => {
    console.log(`Confirmed promotion for patient ${patient.name} to appointment ${selectedAppointmentId}`);
    setIsDialogOpen(false);
  };
  
  const getWeekDateRange = () => {
    const today = new Date('2026-03-23T12:00:00Z'); // Using a fixed date for consistency
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
          onViewCalendar={() => setCurrentView('Schedule')}
        />
      );
    } else if (currentView === 'Schedule') {
      return (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Weekly Schedule</h2>
          <CalendarView appointments={appointments} onPromote={handlePromote} />
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
        onClose={() => setIsDialogOpen(false)} 
        title="Select Backup Patient"
      >
        <p style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Select a patient from the waitlist to auto-promote to appointment slot #{selectedAppointmentId}. Patients are ordered by highest match score.
        </p>
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
              onClick={() => confirmPromotion(patient)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div>
                <strong style={{ display: 'block', color: 'var(--text-dark)' }}>{patient.name} ({patient.id})</strong>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{patient.distance} miles away</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{patient.match_score}% Match</div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Click to Promote</span>
              </div>
            </div>
          ))}
          {suggestedBackups.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>No suitable backups found.</p>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default App;
