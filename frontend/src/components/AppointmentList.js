import React, { useState, useEffect } from 'react';
import './AppointmentList.css';
import BackupSuggestionModal from './BackupSuggestionModal';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetching from backend API (defaulting to localhost or mock environment)
        const response = await fetch(process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data.appointments || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const getRiskColor = (probability) => {
    const probPct = probability * 100;
    if (probPct <= 30) return 'green';
    if (probPct <= 70) return '#d4b106'; // a darker yellow for readability
    return 'red';
  };

  return (
    <div className="appointment-list-container">
      <h2>Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments found.</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient ID</th>
              <th>Provider</th>
              <th>Type</th>
              <th>Probability</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{new Date(appt.time).toLocaleString()}</td>
                <td>{appt.patient_id}</td>
                <td>{appt.provider}</td>
                <td>{appt.type}</td>
                <td style={{ color: getRiskColor(appt.no_show_probability), fontWeight: 'bold' }}>
                  {(appt.no_show_probability * 100).toFixed(1)}%
                </td>
                <td>
                  {appt.no_show_probability * 100 > 70 && (
                    <button 
                      className="find-backup-btn"
                      onClick={() => setSelectedAppointment(appt)}
                    >
                      Find Backup
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {selectedAppointment && (
        <BackupSuggestionModal 
          appointment={selectedAppointment} 
          onClose={() => setSelectedAppointment(null)} 
        />
      )}
    </div>
  );
};

export default AppointmentList;
