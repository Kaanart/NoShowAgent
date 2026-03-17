import React, { useState, useEffect } from 'react';
import './CalendarDashboard.css';
import BackupSuggestionModal from './BackupSuggestionModal';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

const getRiskClass = (risk) => {
  if (risk < 30) return 'low-risk';
  if (risk <= 50) return 'med-risk';
  return 'high-risk';
};

const INITIAL_MOCK_DATA = [
  { id: 'A001', day: 'Monday', hour: '09:00', patient: 'P-552', type: 'Checkup', risk: 15 },
  { id: 'A002', day: 'Monday', hour: '11:00', patient: 'P-102', type: 'MRI Scan', risk: 85 },
  { id: 'A003', day: 'Monday', hour: '14:00', patient: 'P-882', type: 'Consultation', risk: 45 },
  { id: 'A004', day: 'Tuesday', hour: '08:00', patient: 'P-332', type: 'Bloodwork', risk: 10 },
  { id: 'A005', day: 'Tuesday', hour: '10:00', patient: 'P-441', type: 'Therapy', risk: 92 },
  { id: 'A006', day: 'Tuesday', hour: '15:00', patient: 'P-119', type: 'Checkup', risk: 65 },
  { id: 'A007', day: 'Wednesday', hour: '09:00', patient: 'P-702', type: 'Follow-up', risk: 25 },
  { id: 'A008', day: 'Wednesday', hour: '13:00', patient: 'P-221', type: 'Consultation', risk: 78 },
  { id: 'A009', day: 'Wednesday', hour: '16:00', patient: 'P-901', type: 'MRI Scan', risk: 52 },
  { id: 'A010', day: 'Thursday', hour: '11:00', patient: 'P-338', type: 'Bloodwork', risk: 35 },
  { id: 'A011', day: 'Thursday', hour: '14:00', patient: 'P-449', type: 'Surgery Prep', risk: 88 },
  { id: 'A012', day: 'Thursday', hour: '17:00', patient: 'P-121', type: 'Follow-up', risk: 12 },
  { id: 'A013', day: 'Friday', hour: '08:00', patient: 'P-550', type: 'Checkup', risk: 42 },
  { id: 'A014', day: 'Friday', hour: '12:00', patient: 'P-991', type: 'Therapy', risk: 95 },
  { id: 'A015', day: 'Friday', hour: '15:00', patient: 'P-202', type: 'Consultation', risk: 18 },
  { id: 'A016', day: 'Saturday', hour: '10:00', patient: 'P-661', type: 'Checkup', risk: 5 },
];

const CalendarDashboard = () => {
  const [appointments, setAppointments] = useState(INITIAL_MOCK_DATA);
  const [loading, setLoading] = useState(false); // Set to false since we use mock data
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    // We can still try to fetch, but we'll default to mock data if it fails
    const fetchAppointments = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8081/');
        if (response.ok) {
          const data = await response.json();
          if (data.appointments && data.appointments.length > 5) {
             const formatted = data.appointments.map(appt => {
                const date = new Date(appt.time);
                const dayString = date.toLocaleDateString('en-US', { weekday: 'long' });
                let hourStr = date.getHours().toString().padStart(2, '0') + ':00';
                return {
                  ...appt,
                  day: dayString,
                  hour: hourStr,
                  patient: appt.patient_id,
                  type: appt.type,
                  risk: Math.round(appt.no_show_probability * 100)
                };
             });
             setAppointments(formatted);
          }
        }
      } catch (err) {
        console.log("Backend fetch failed, using frontend mock data instead.");
      }
    };

    fetchAppointments();
  }, []);

  const getAppointment = (day, hour) => {
    return appointments.find(appt => appt.day === day && appt.hour === hour);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading schedule...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header-title">
        <h2>Weekly Schedule Overview</h2>
        <p>Monitor high-risk appointments and proactively find backups.</p>
      </div>

      <div className="calendar-grid">
        {/* Top-left corner block */}
        <div className="grid-header-corner">Time</div>
        
        {/* Day Headers */}
        {DAYS.map(day => (
          <div key={day} className="grid-header-day">{day}</div>
        ))}

        {/* Calendar Body (Hours & Cells) */}
        {HOURS.map(hour => (
          <React.Fragment key={hour}>
            {/* Time Label on the left */}
            <div className="grid-time-label">{hour}</div>
            
            {/* Cells for each day at this hour */}
            {DAYS.map(day => {
              const appt = getAppointment(day, hour);
              return (
                <div key={`${day}-${hour}`} className="grid-cell">
                  {appt && (
                    <div className={`appt-card ${getRiskClass(appt.risk)}`}>
                      <div className="appt-header">
                        <span className="appt-patient">{appt.patient}</span>
                        <span className="appt-type">{appt.type}</span>
                      </div>
                      <div className="appt-footer">
                        <span className="appt-risk">Risk: {appt.risk}%</span>
                        {appt.risk > 50 && (
                          <button 
                            className="find-backup-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appt);
                            }}
                          >
                            Find Backup
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {selectedAppointment && (
        <BackupSuggestionModal 
          appointment={selectedAppointment} 
          onClose={() => setSelectedAppointment(null)} 
        />
      )}
    </div>
  );
};

export default CalendarDashboard;