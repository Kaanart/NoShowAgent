import React, { useState, useEffect } from 'react';
import './AppointmentList.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetching from backend API (defaulting to localhost or mock environment)
        const response = await fetch(process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/api/dashboard');
        
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
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{new Date(appt.time).toLocaleString()}</td>
                <td>{appt.patient_id}</td>
                <td>{appt.provider}</td>
                <td>{appt.type}</td>
                <td>{(appt.no_show_probability * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;
