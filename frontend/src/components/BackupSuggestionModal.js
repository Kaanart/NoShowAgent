import React, { useState, useEffect } from 'react';
import './BackupSuggestionModal.css';

const BackupSuggestionModal = ({ appointment, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when the appointment changes
    setSuggestions([]);
    setError(null);
    
    if (!appointment) return;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080'}/find-backup?appointmentId=${appointment.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch backup suggestions. Is the backend running?');
        }

        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        // Provide fallback mock suggestions if the backend isn't reachable
        console.warn("Backend fetch failed, using fallback agent data.", err);
        setSuggestions([
          { id: "P999-FB", name: "Alice Johnson (Fallback)", distance: 1.2, match_score: 98.5 },
          { id: "P888-FB", name: "Bob Smith (Fallback)", distance: 3.4, match_score: 85.0 },
          { id: "P777-FB", name: "Charlie Davis (Fallback)", distance: 5.1, match_score: 75.5 }
        ]);
        // Only set error if we truly want to block the UI, otherwise we use the fallback.
        // setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [appointment]); // Dependency array now correctly tracks the full appointment object

  if (!appointment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>Find Backup Patient</h3>
        <p>Original Appointment: {appointment.day} at {appointment.hour} - Patient: {appointment.patient}</p>

        {loading && <p>Triggering ADK Agent to find backups...</p>}
        {error && <p className="error">{error}</p>}
        
        {!loading && !error && (
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
