import React from 'react';
import './CalendarView.css';

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
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Helper to calculate position
  const getAppointmentStyle = (time: string) => {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    // Each hour is 60px high. Start at 8 AM.
    const top = (hour - 8) * 60 + (minute / 60) * 60;
    return { top: `${top}px`, height: '50px' };
  };

  // Group appointments by day
  const appointmentsByDay: { [key: string]: Appointment[] } = {};
  appointments.forEach(appt => {
    const date = new Date(appt.appointment_date);
    // getDay() is 0 for Sunday, 1 for Monday...
    let dayIndex = date.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6; // Sunday
    const dayName = days[dayIndex];
    
    if (!appointmentsByDay[dayName]) {
      appointmentsByDay[dayName] = [];
    }
    appointmentsByDay[dayName].push(appt);
  });

  return (
    <div className="calendar-container">
      <div className="calendar-header-row">
        <div className="time-gutter-header"></div>
        {days.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        <div className="time-gutter">
          {hours.map(hour => (
            <div key={hour} className="time-label">{hour}:00</div>
          ))}
        </div>
        
        {days.map(day => (
          <div key={day} className="day-column">
            {(appointmentsByDay[day] || []).map(appt => (
              <div 
                key={appt.id} 
                className={`appointment-slot ${appt.risk_score > 0.5 ? 'high-risk' : ''}`}
                style={getAppointmentStyle(appt.appointment_time)}
              >
                <div className="appointment-title">{appt.patient_name} (ID: {appt.id})</div>
                <div className="appointment-time">{appt.appointment_time}</div>
                <div>Risk: {Math.round(appt.risk_score * 100)}%</div>
                {appt.risk_score > 0.5 && (
                  <button className="promote-btn" onClick={() => onPromote(appt.id)}>Auto-Promote</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
