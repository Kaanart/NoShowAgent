import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Waitlist from './components/Waitlist';

function App() {
  const [appointments] = useState([
    { id: 1, age: 30, past_no_shows: 0, risk_score: 0.1 },
    { id: 2, age: 25, past_no_shows: 5, risk_score: 0.8 },
  ]);

  const [waitlistPatients] = useState([
    { id: 101, patient_name: "John Doe", urgency: "high", requested_days: [1, 2] },
    { id: 102, patient_name: "Jane Smith", urgency: "medium", requested_days: [2, 3] },
  ]);

  const handlePromote = (appointmentId: number) => {
    console.log(`Promoting patient to appointment ${appointmentId}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MRI No-Show Prediction</h1>
      </header>
      <main>
        <Dashboard appointments={appointments} onPromote={handlePromote} />
        <Waitlist patients={waitlistPatients} />
      </main>
    </div>
  );
}

export default App;
