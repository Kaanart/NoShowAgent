import React, { useState } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [appointments] = useState([
    { id: 1, age: 30, past_no_shows: 0, risk_score: 0.1 },
    { id: 2, age: 25, past_no_shows: 5, risk_score: 0.8 },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>MRI No-Show Prediction</h1>
      </header>
      <main>
        <Dashboard appointments={appointments} />
      </main>
    </div>
  );
}

export default App;
