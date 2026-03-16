import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Waitlist from './components/Waitlist';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [appointments] = useState([
    { 
      id: 1, 
      patient_name: "John Doe",
      age: 30, 
      past_no_shows: 0, 
      risk_score: 0.1,
      appointment_date: "2026-03-23",
      appointment_time: "10:00"
    },
    { 
      id: 2, 
      patient_name: "Jane Smith",
      age: 25, 
      past_no_shows: 5, 
      risk_score: 0.8,
      appointment_date: "2026-03-24",
      appointment_time: "14:30"
    },
  ]);

  const [waitlistPatients] = useState([
    { id: 101, patient_name: "John Doe", urgency: "high", requested_days: [1, 2] },
    { id: 102, patient_name: "Jane Smith", urgency: "medium", requested_days: [2, 3] },
  ]);

  const handlePromote = (appointmentId: number) => {
    console.log(`Promoting patient to appointment ${appointmentId}`);
  };

  const renderContent = () => {
    if (currentView === 'Dashboard') {
      return (
        <>
          <Dashboard appointments={appointments} onPromote={handlePromote} />
          <Waitlist patients={waitlistPatients} />
        </>
      );
    } else if (currentView === 'Schedule') {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dark)' }}>
          <h2>Schedule View Placeholder</h2>
          <p>This is where the full schedule would go.</p>
        </div>
      );
    }
    return <div>View Not Found</div>;
  };

  return (
    <div className="app-layout">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false); // Close on mobile after selection
        }} 
        isOpen={isSidebarOpen} 
      />
      
      <main className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="header-title">MRI Lab Scheduling Dashboard</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>
        
        <div className="scrollable-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
