import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface Appointment {
  id: number;
  patient_name: string;
  age: number;
  past_no_shows: number;
  risk_score: number;
  appointment_date: string;
  appointment_time: string;
  scan_type?: string;
  duration?: number;
}

interface DashboardProps {
  appointments: Appointment[];
  onPromote: (appointmentId: number) => void;
  onViewCalendar: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, onPromote, onViewCalendar }) => {
  const uniqueDates = Array.from(new Set(appointments.map(a => a.appointment_date))).sort();
  const [selectedDate, setSelectedDate] = useState<string>(uniqueDates[0] || '');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  useEffect(() => {
    if (uniqueDates.length > 0 && (!selectedDate || !uniqueDates.includes(selectedDate))) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [appointments, selectedDate]);

  let filteredAppointments = appointments.filter(a => a.appointment_date === selectedDate);
  
  if (riskFilter !== 'All') {
    filteredAppointments = filteredAppointments.filter(appt => {
      if (riskFilter === 'High') return appt.risk_score > 0.7;
      if (riskFilter === 'Medium') return appt.risk_score > 0.4 && appt.risk_score <= 0.7;
      if (riskFilter === 'Low') return appt.risk_score <= 0.4;
      return true;
    });
  }

  const formatDay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getRelativeDate = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString + 'T00:00:00');
    
    const diffTime = targetDate.getTime() - today.setHours(0,0,0,0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTimeRange = (time: string, duration: number = 60) => {
    const [hourStr, minuteStr] = time.split(':');
    const startHour = parseInt(hourStr, 10);
    const startMinute = parseInt(minuteStr, 10);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    const format = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };
    
    return `${format(startDate)} - ${format(endDate)}`;
  };

  const getScoreColors = (score: number) => {
    if (score > 0.7) return { text: '#d93025', bg: '#fce8e6', bar: '#d93025' };
    if (score > 0.4) return { text: '#e37400', bg: '#fff4e5', bar: '#e37400' };
    return { text: '#188038', bg: '#e6f4ea', bar: '#188038' };
  };

  return (
    <div className="dashboard" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Summary Metrics Section */}
      <section style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: '140px', padding: '1.5rem' }}>
          <p style={{ color: '#5f6368', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall No-Show Risk</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>15%</span>
            <span style={{ color: '#d93025', fontSize: '0.875rem', fontWeight: 500, backgroundColor: '#fce8e6', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>↓ 2%</span>
          </div>
        </Card>
        <Card style={{ flex: 1, minWidth: '140px', padding: '1.5rem' }}>
          <p style={{ color: '#5f6368', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slots to Backfill</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>4</span>
            <span style={{ color: '#188038', fontSize: '0.875rem', fontWeight: 500, backgroundColor: '#e6f4ea', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>↑ 1</span>
          </div>
        </Card>
        <Card style={{ flex: 1, minWidth: '140px', padding: '1.5rem' }}>
          <p style={{ color: '#5f6368', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Utilization Rate</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>88%</span>
            <span style={{ color: '#188038', fontSize: '0.875rem', fontWeight: 500, backgroundColor: '#e6f4ea', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>↑ 5%</span>
          </div>
        </Card>
        <Card style={{ flex: 1, minWidth: '140px', padding: '1.5rem' }}>
          <p style={{ color: '#5f6368', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Appointments</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>142</span>
          </div>
        </Card>
      </section>

      {/* Daily Outlook Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>One Day Outlook</h2>
                <p style={{ color: '#5f6368', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Manage upcoming appointments and no-show risks.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '8px', padding: '0 0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#5f6368', marginRight: '4px' }}>filter_list</span>
                    <select 
                        value={riskFilter} 
                        onChange={(e) => setRiskFilter(e.target.value as any)}
                        style={{ border: 'none', padding: '0.5rem 0', fontSize: '0.875rem', color: '#3c4043', outline: 'none', cursor: 'pointer', backgroundColor: 'transparent', height: '100%' }}
                    >
                        <option value="All">All Risks</option>
                        <option value="High">High Risk (&gt;70%)</option>
                        <option value="Medium">Medium Risk (40-70%)</option>
                        <option value="Low">Low Risk (&lt;40%)</option>
                    </select>
                </div>
                <Button variant="primary" style={{ borderRadius: '8px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }} onClick={onViewCalendar}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }}>calendar_month</span>
                    View Calendar
                </Button>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {uniqueDates.map(date => (
            <button 
              key={date} 
              onClick={() => setSelectedDate(date)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid ' + (selectedDate === date ? 'var(--primary)' : '#dadce0'),
                backgroundColor: selectedDate === date ? 'var(--primary)' : 'white',
                color: selectedDate === date ? 'white' : '#3c4043',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {formatDay(date)}
            </button>
          ))}
        </div>

        <Card>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f3f4' }}>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RISK</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PATIENT NAME</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SCAN TYPE</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATE & TIME</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PREDICTION SCORE</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => {
                  const colors = getScoreColors(appt.risk_score);
                  return (
                    <tr key={appt.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        {appt.risk_score > 0.7 ? (
                            <span className="material-symbols-outlined" style={{ color: '#d93025', fontVariationSettings: "'FILL' 1" }}>warning</span>
                        ) : (
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.bar, marginLeft: '7px' }}></div>
                        )}
                      </td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#202124', fontSize: '0.9375rem' }}>{appt.patient_name}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#5f6368', fontSize: '0.9375rem' }}>{appt.scan_type || 'Brain MRI'}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#202124', fontSize: '0.9375rem' }}>{getRelativeDate(appt.appointment_date)}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#70757a' }}>{getTimeRange(appt.appointment_time, appt.duration)}</div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                           <span style={{
                              minWidth: '45px',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: colors.bg,
                              color: colors.text,
                              textAlign: 'center'
                            }}>
                              {Math.round(appt.risk_score * 100)}%
                            </span>
                            <div style={{ width: '80px', height: '6px', backgroundColor: '#e8eaed', borderRadius: '3px' }}>
                               <div style={{ width: `${appt.risk_score * 100}%`, height: '100%', backgroundColor: colors.bar, borderRadius: '3px' }}></div>
                            </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        {appt.risk_score > 0.5 && (
                          <Button variant="danger" size="sm" onClick={() => onPromote(appt.id)} style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', borderRadius: '6px' }}>Find a Backup</Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#70757a' }}>
                    No appointments for this day.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Footer Pagination Mock */}
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f3f4', color: '#70757a', fontSize: '0.875rem' }}>
            <div>Showing 1 to {filteredAppointments.length} of 142 appointments</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>chevron_left</span>
                <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>chevron_right</span>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
};

export default Dashboard;
