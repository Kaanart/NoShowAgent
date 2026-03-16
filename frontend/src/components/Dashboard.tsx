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
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, onPromote }) => {
  const uniqueDates = Array.from(new Set(appointments.map(a => a.appointment_date))).sort();
  const [selectedDate, setSelectedDate] = useState<string>(uniqueDates[0] || '');

  useEffect(() => {
    if (uniqueDates.length > 0 && (!selectedDate || !uniqueDates.includes(selectedDate))) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [appointments, selectedDate]);

  const filteredAppointments = appointments.filter(a => a.appointment_date === selectedDate);

  const formatDay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="dashboard" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Summary Metrics Section */}
      <section style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: '140px', padding: '1rem' }}>
          <p style={{ color: 'var(--text-dark)', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.5rem 0' }}>No-Show Risk</p>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>15%</div>
        </Card>
        <Card style={{ flex: 1, minWidth: '140px', padding: '1rem' }}>
          <p style={{ color: 'var(--text-dark)', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.5rem 0' }}>Slots to Backfill</p>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>4</div>
        </Card>
        <Card style={{ flex: 1, minWidth: '140px', padding: '1rem' }}>
          <p style={{ color: 'var(--text-dark)', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.5rem 0' }}>Utilization</p>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>88%</div>
        </Card>
      </section>

      {/* Daily Outlook Section */}
      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>One Day Outlook</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {uniqueDates.map(date => (
            <Button 
              key={date} 
              variant={selectedDate === date ? 'primary' : 'secondary'} 
              onClick={() => setSelectedDate(date)}
            >
              {formatDay(date)}
            </Button>
          ))}
        </div>
        <Card>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem' }}>RISK</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem' }}>PATIENT NAME</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem' }}>SCAN TYPE</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem' }}>DATE & TIME</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem' }}>PREDICTION SCORE</th>
                <th style={{ padding: '1rem', color: '#70757a', fontWeight: 600, fontSize: '0.75rem' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: appt.risk_score > 0.5 ? 'var(--status-high-risk)' : 'var(--status-low-risk)' }}></div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>{appt.patient_name}</td>
                    <td style={{ padding: '1rem', color: '#5f6368' }}>{appt.scan_type || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Today</div>
                      <div style={{ fontSize: '0.875rem', color: '#5f6368' }}>{appt.appointment_time} - {appt.appointment_time}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: appt.risk_score > 0.5 ? 'var(--status-high-risk-bg)' : 'var(--status-low-risk-bg)',
                            color: appt.risk_score > 0.5 ? 'var(--status-high-risk)' : 'var(--status-low-risk)'
                          }}>
                            {Math.round(appt.risk_score * 100)}%
                          </span>
                          <div style={{ flex: 1, height: '6px', backgroundColor: '#e8eaed', borderRadius: '3px', minWidth: '60px' }}>
                             <div style={{ width: `${appt.risk_score * 100}%`, height: '100%', backgroundColor: appt.risk_score > 0.5 ? 'var(--status-high-risk)' : 'var(--status-low-risk)', borderRadius: '3px' }}></div>
                          </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {appt.risk_score > 0.5 && (
                        <Button variant="danger" size="sm" onClick={() => onPromote(appt.id)} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Find a Backup</Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dark)' }}>
                    No appointments for this day.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </section>

    </div>
  );
};

export default Dashboard;
