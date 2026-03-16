import React from 'react';
import CalendarView from './CalendarView';

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
    <div className="dashboard">
      <h2>Risk Dashboard</h2>
      <CalendarView appointments={appointments} onPromote={onPromote} />
    </div>
  );
};

export default Dashboard;
