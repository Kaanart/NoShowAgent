import React from 'react';
import './CalendarView.css';

interface Appointment {
  id: number;
  patient_name: string;
  age: number;
  risk_score: number;
  appointment_date: string;
  appointment_time: string;
  scan_type?: string;
  duration?: number;
}

interface CalendarViewProps {
  appointments: Appointment[];
  onPromote: (appointmentId: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onPromote }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Group appointments by day
  const appointmentsByDay: { [key: string]: Appointment[] } = {};
  appointments.forEach(appt => {
    const date = new Date(appt.appointment_date);
    // getDay() is 0 for Sunday, 1 for Monday...
    let dayIndex = date.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6; // Sunday
    const dayName = days[dayIndex];
    
    if (days.includes(dayName)) {
      if (!appointmentsByDay[dayName]) {
        appointmentsByDay[dayName] = [];
      }
      appointmentsByDay[dayName].push(appt);
    }
  });

  const getMinutes = (time: string) => {
    const [h, m] = time.split(':');
    return (parseInt(h, 10) - 8) * 60 + parseInt(m, 10);
  };

  // Content-aware duration for overlap checking
  const getVisualDuration = (appt: Appointment) => {
    const duration = appt.duration || 60;
    // An appointment needs at least ~85px of vertical space to display its content fully without clipping.
    return Math.max(duration, 85);
  };

  const getLayoutStyles = (dayAppts: Appointment[]) => {
    const sorted = [...dayAppts].sort((a, b) => getMinutes(a.appointment_time) - getMinutes(b.appointment_time));
    const positions: { [id: number]: React.CSSProperties } = {};
    
    let lastEnd = 0;
    let group: Appointment[] = [];
    const groups: Appointment[][] = [];
    
    // Group overlapping appointments
    for (const appt of sorted) {
        const start = getMinutes(appt.appointment_time);
        const visualDuration = getVisualDuration(appt);
        
        if (start >= lastEnd) {
            if (group.length > 0) groups.push(group);
            group = [appt];
        } else {
            group.push(appt);
        }
        lastEnd = Math.max(lastEnd, start + visualDuration);
    }
    if (group.length > 0) groups.push(group);
    
    // Calculate columns within each group
    for (const grp of groups) {
        const groupCols: Appointment[][] = [];
        for (const appt of grp) {
            const start = getMinutes(appt.appointment_time);
            let placed = false;
            for (const col of groupCols) {
                const lastAppt = col[col.length - 1];
                const lastApptEnd = getMinutes(lastAppt.appointment_time) + getVisualDuration(lastAppt);
                if (lastApptEnd <= start) {
                    col.push(appt);
                    placed = true;
                    break;
                }
            }
            if (!placed) groupCols.push([appt]);
        }
        
        const numCols = groupCols.length;
        groupCols.forEach((col, colIndex) => {
            col.forEach(appt => {
                const start = getMinutes(appt.appointment_time);
                const duration = appt.duration || 60;
                positions[appt.id] = {
                    top: `${start}px`,
                    minHeight: `${duration}px`,
                    left: `calc(${(colIndex / numCols) * 100}% + 4px)`,
                    width: `calc(${100 / numCols}% - 8px)`,
                    right: 'auto',
                    position: 'absolute'
                };
            });
        });
    }

    return positions;
  };

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
        
        {days.map(day => {
          const dayAppts = appointmentsByDay[day] || [];
          const layoutStyles = getLayoutStyles(dayAppts);
          return (
            <div key={day} className="day-column">
              {dayAppts.map(appt => (
                <div 
                  key={appt.id} 
                  className={`appointment-slot ${appt.risk_score > 0.5 ? 'high-risk' : ''}`}
                  style={layoutStyles[appt.id]}
                >
                  <div className="appointment-title">{appt.patient_name} (ID: {appt.id})</div>
                  <div className="appointment-time">{appt.appointment_time} {appt.scan_type && `- ${appt.scan_type}`}</div>
                  <div>Risk: {Math.round(appt.risk_score * 100)}%</div>
                  {appt.risk_score > 0.5 && (
                    <button className="promote-btn" onClick={() => onPromote(appt.id)}>Find a Backup</button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
