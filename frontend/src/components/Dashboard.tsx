import React from 'react';
import CalendarView from './CalendarView';
import Card from './ui/Card';

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

      {/* Calendar Section */}
      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>One-Week Outlook</h2>
        <CalendarView appointments={appointments} onPromote={onPromote} />
      </section>

    </div>
  );
};

export default Dashboard;
