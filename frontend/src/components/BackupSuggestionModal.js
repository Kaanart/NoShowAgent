import React, { useState } from 'react';
import './BackupSuggestionModal.css';

const BackupSuggestionModal = ({ appointment, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint for the ADK agent that finds backups
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/api'}/find-backup?appointmentId=${appointment.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch backup suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setHasFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch immediately upon mounting
  React.useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>Find Backup Patient</h3>
        <p>Original Appointment: {new Date(appointment.time).toLocaleString()} - Patient: {appointment.patient_id}</p>

        {loading && <p>Triggering ADK Agent to find backups...</p>}
        {error && <p className="error">{error}</p>}
        
        {hasFetched && !loading && !error && (
          <div>
            {suggestions.length === 0 ? (
              <p>No suitable backups found.</p>
            ) : (
              <ul className="suggestion-list">
                {suggestions.map((patient, index) => (
                  <li key={index} className="suggestion-item">
                    <strong>ID:</strong> {patient.id} | <strong>Name:</strong> {patient.name} <br/>
                    <strong>Distance:</strong> {patient.distance} miles | <strong>Score:</strong> {patient.match_score}
                    <button className="contact-btn">Initiate Contact</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupSuggestionModal;
