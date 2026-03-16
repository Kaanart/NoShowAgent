import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Waitlist from './components/Waitlist';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [appointments] = useState([
    {
        "id": 1,
        "patient_name": "Frank Thompson",
        "age": 61,
        "past_no_shows": 0,
        "risk_score": 0.58,
        "appointment_date": "2026-03-23",
        "appointment_time": "15:00"
    },
    {
        "id": 2,
        "patient_name": "Ursula Thomas",
        "age": 36,
        "past_no_shows": 2,
        "risk_score": 0.2,
        "appointment_date": "2026-03-24",
        "appointment_time": "10:00"
    },
    {
        "id": 3,
        "patient_name": "Eve White",
        "age": 58,
        "past_no_shows": 1,
        "risk_score": 0.37,
        "appointment_date": "2026-03-26",
        "appointment_time": "18:00"
    },
    {
        "id": 4,
        "patient_name": "Oscar Rodriguez",
        "age": 34,
        "past_no_shows": 2,
        "risk_score": 0.57,
        "appointment_date": "2026-03-25",
        "appointment_time": "15:00"
    },
    {
        "id": 5,
        "patient_name": "Ursula White",
        "age": 26,
        "past_no_shows": 0,
        "risk_score": 0.23,
        "appointment_date": "2026-03-26",
        "appointment_time": "09:00"
    },
    {
        "id": 6,
        "patient_name": "Quinn Miller",
        "age": 66,
        "past_no_shows": 0,
        "risk_score": 0.37,
        "appointment_date": "2026-03-24",
        "appointment_time": "18:00"
    },
    {
        "id": 7,
        "patient_name": "John Lopez",
        "age": 57,
        "past_no_shows": 1,
        "risk_score": 0.25,
        "appointment_date": "2026-03-24",
        "appointment_time": "17:00"
    },
    {
        "id": 8,
        "patient_name": "Hank Davis",
        "age": 73,
        "past_no_shows": 1,
        "risk_score": 0.5,
        "appointment_date": "2026-03-23",
        "appointment_time": "17:00"
    },
    {
        "id": 9,
        "patient_name": "Charlie Wilson",
        "age": 43,
        "past_no_shows": 0,
        "risk_score": 0.48,
        "appointment_date": "2026-03-23",
        "appointment_time": "09:00"
    },
    {
        "id": 10,
        "patient_name": "Oscar Anderson",
        "age": 56,
        "past_no_shows": 0,
        "risk_score": 0.87,
        "appointment_date": "2026-03-26",
        "appointment_time": "18:00"
    },
    {
        "id": 11,
        "patient_name": "Tina Davis",
        "age": 37,
        "past_no_shows": 0,
        "risk_score": 0.19,
        "appointment_date": "2026-03-25",
        "appointment_time": "16:00"
    },
    {
        "id": 12,
        "patient_name": "Jane Gonzalez",
        "age": 80,
        "past_no_shows": 0,
        "risk_score": 0.27,
        "appointment_date": "2026-03-24",
        "appointment_time": "10:00"
    },
    {
        "id": 13,
        "patient_name": "Frank Brown",
        "age": 54,
        "past_no_shows": 5,
        "risk_score": 0.92,
        "appointment_date": "2026-03-27",
        "appointment_time": "18:00"
    },
    {
        "id": 14,
        "patient_name": "Eve Thomas",
        "age": 48,
        "past_no_shows": 2,
        "risk_score": 0.9,
        "appointment_date": "2026-03-23",
        "appointment_time": "16:00"
    },
    {
        "id": 15,
        "patient_name": "Oscar Gonzalez",
        "age": 55,
        "past_no_shows": 5,
        "risk_score": 0.54,
        "appointment_date": "2026-03-27",
        "appointment_time": "09:00"
    },
    {
        "id": 16,
        "patient_name": "Victor Moore",
        "age": 55,
        "past_no_shows": 1,
        "risk_score": 0.63,
        "appointment_date": "2026-03-24",
        "appointment_time": "12:00"
    },
    {
        "id": 17,
        "patient_name": "Victor Martin",
        "age": 55,
        "past_no_shows": 2,
        "risk_score": 0.17,
        "appointment_date": "2026-03-26",
        "appointment_time": "17:00"
    },
    {
        "id": 18,
        "patient_name": "Jane Williams",
        "age": 57,
        "past_no_shows": 2,
        "risk_score": 0.38,
        "appointment_date": "2026-03-26",
        "appointment_time": "15:00"
    },
    {
        "id": 19,
        "patient_name": "Grace Johnson",
        "age": 30,
        "past_no_shows": 0,
        "risk_score": 0.43,
        "appointment_date": "2026-03-24",
        "appointment_time": "12:00"
    },
    {
        "id": 20,
        "patient_name": "Alice Lopez",
        "age": 76,
        "past_no_shows": 0,
        "risk_score": 0.65,
        "appointment_date": "2026-03-26",
        "appointment_time": "08:00"
    },
    {
        "id": 21,
        "patient_name": "Tina Johnson",
        "age": 37,
        "past_no_shows": 0,
        "risk_score": 0.07,
        "appointment_date": "2026-03-24",
        "appointment_time": "18:00"
    },
    {
        "id": 22,
        "patient_name": "Charlie Smith",
        "age": 24,
        "past_no_shows": 2,
        "risk_score": 0.84,
        "appointment_date": "2026-03-26",
        "appointment_time": "12:00"
    },
    {
        "id": 23,
        "patient_name": "Alice Thomas",
        "age": 71,
        "past_no_shows": 0,
        "risk_score": 0.18,
        "appointment_date": "2026-03-23",
        "appointment_time": "14:00"
    },
    {
        "id": 24,
        "patient_name": "Diana Thomas",
        "age": 27,
        "past_no_shows": 0,
        "risk_score": 0.94,
        "appointment_date": "2026-03-24",
        "appointment_time": "09:00"
    },
    {
        "id": 25,
        "patient_name": "Karen Garcia",
        "age": 70,
        "past_no_shows": 1,
        "risk_score": 0.39,
        "appointment_date": "2026-03-25",
        "appointment_time": "10:00"
    }
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
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Weekly Schedule</h2>
          <CalendarView appointments={appointments} onPromote={handlePromote} />
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
