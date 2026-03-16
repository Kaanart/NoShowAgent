import React from 'react';
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
}

interface DashboardProps {
  appointments: Appointment[];
  onPromote: (appointmentId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, onPromote }) => {
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
        <Card>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>Patient Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>Risk</th>
                <th style={{ padding: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem' }}>{appt.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{appt.patient_name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-dark)' }}>{appt.appointment_time}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      backgroundColor: appt.risk_score > 0.5 ? 'var(--status-high-risk-bg)' : 'var(--status-low-risk-bg)',
                      color: appt.risk_score > 0.5 ? 'var(--status-high-risk)' : 'var(--status-low-risk)'
                    }}>
                      {Math.round(appt.risk_score * 100)}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {appt.risk_score > 0.5 && (
                      <Button variant="danger" onClick={() => onPromote(appt.id)}>Auto-Promote</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

    </div>
  );
};

export default Dashboard;
