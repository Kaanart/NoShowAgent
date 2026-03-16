import React from 'react';

interface Appointment {
  id: number;
  patient_name: string;
  age: number;
  risk_score: number;
  appointment_date: string;
  appointment_time: string;
}

interface CalendarViewProps {
  appointments: Appointment[];
  onPromote: (appointmentId: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onPromote }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="calendar-view">
      <div className="calendar-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {days.map(day => (
          <div key={day} style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-body">
        {appointments.map(appt => (
          <div key={appt.id} className="appointment-card" style={{ border: '1px solid #eee', margin: '5px', padding: '5px' }}>
            <strong>{appt.patient_name} (ID: {appt.id})</strong>
            <div>{appt.appointment_time}</div>
            <div>Risk: {Math.round(appt.risk_score * 100)}%</div>
            {appt.risk_score > 0.5 && (
              <button onClick={() => onPromote(appt.id)}>Auto-Promote</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
