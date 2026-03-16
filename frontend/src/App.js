import React from 'react';
import './App.css';
import CalendarDashboard from './components/CalendarDashboard';

function App() {
  return (
    <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header className="App-header">
        <h1>🏥 No-Show AI Agent</h1>
      </header>
      <main style={{ backgroundColor: '#f4f7f6', flex: 1, overflow: 'hidden', display: 'flex' }}>
        <CalendarDashboard />
      </main>
    </div>
  );
}

export default App;
