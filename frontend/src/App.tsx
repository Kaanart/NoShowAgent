import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [appointments] = useState(
[
    {
        "id": 1,
        "patient_name": "Ursula Williams",
        "age": 49,
        "past_no_shows": 5,
        "risk_score": 0.8,
        "appointment_date": "2026-03-27",
        "appointment_time": "08:00",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 2,
        "patient_name": "Tina Taylor",
        "age": 68,
        "past_no_shows": 0,
        "risk_score": 0.37,
        "appointment_date": "2026-03-27",
        "appointment_time": "08:30",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 3,
        "patient_name": "Bob Gonzalez",
        "age": 36,
        "past_no_shows": 0,
        "risk_score": 0.59,
        "appointment_date": "2026-03-27",
        "appointment_time": "09:00",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 4,
        "patient_name": "Alice Lee",
        "age": 38,
        "past_no_shows": 0,
        "risk_score": 0.63,
        "appointment_date": "2026-03-25",
        "appointment_time": "08:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 5,
        "patient_name": "Alice White",
        "age": 34,
        "past_no_shows": 5,
        "risk_score": 0.1,
        "appointment_date": "2026-03-27",
        "appointment_time": "09:30",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 6,
        "patient_name": "Ivy Thomas",
        "age": 62,
        "past_no_shows": 2,
        "risk_score": 0.17,
        "appointment_date": "2026-03-26",
        "appointment_time": "08:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 7,
        "patient_name": "Leo Jackson",
        "age": 59,
        "past_no_shows": 5,
        "risk_score": 0.75,
        "appointment_date": "2026-03-24",
        "appointment_time": "08:00",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 8,
        "patient_name": "Hank Jackson",
        "age": 34,
        "past_no_shows": 2,
        "risk_score": 0.62,
        "appointment_date": "2026-03-27",
        "appointment_time": "10:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 9,
        "patient_name": "Karen Hernandez",
        "age": 50,
        "past_no_shows": 2,
        "risk_score": 0.24,
        "appointment_date": "2026-03-26",
        "appointment_time": "09:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 10,
        "patient_name": "Hank Anderson",
        "age": 60,
        "past_no_shows": 0,
        "risk_score": 0.68,
        "appointment_date": "2026-03-27",
        "appointment_time": "11:00",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 11,
        "patient_name": "Ivy Anderson",
        "age": 48,
        "past_no_shows": 1,
        "risk_score": 0.12,
        "appointment_date": "2026-03-23",
        "appointment_time": "08:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 12,
        "patient_name": "Paul Miller",
        "age": 53,
        "past_no_shows": 0,
        "risk_score": 0.35,
        "appointment_date": "2026-03-26",
        "appointment_time": "10:00",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 13,
        "patient_name": "Frank Garcia",
        "age": 64,
        "past_no_shows": 0,
        "risk_score": 0.62,
        "appointment_date": "2026-03-26",
        "appointment_time": "10:30",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 14,
        "patient_name": "Tina White",
        "age": 64,
        "past_no_shows": 2,
        "risk_score": 0.87,
        "appointment_date": "2026-03-25",
        "appointment_time": "09:00",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 15,
        "patient_name": "Sam Brown",
        "age": 61,
        "past_no_shows": 0,
        "risk_score": 0.11,
        "appointment_date": "2026-03-24",
        "appointment_time": "08:30",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 16,
        "patient_name": "Grace Williams",
        "age": 20,
        "past_no_shows": 0,
        "risk_score": 0.55,
        "appointment_date": "2026-03-24",
        "appointment_time": "09:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 17,
        "patient_name": "Victor Martinez",
        "age": 84,
        "past_no_shows": 0,
        "risk_score": 0.76,
        "appointment_date": "2026-03-25",
        "appointment_time": "09:30",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 18,
        "patient_name": "Rachel Wilson",
        "age": 30,
        "past_no_shows": 0,
        "risk_score": 0.61,
        "appointment_date": "2026-03-25",
        "appointment_time": "10:30",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 19,
        "patient_name": "Jack Jones",
        "age": 19,
        "past_no_shows": 0,
        "risk_score": 0.05,
        "appointment_date": "2026-03-23",
        "appointment_time": "09:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 20,
        "patient_name": "Oscar Anderson",
        "age": 35,
        "past_no_shows": 0,
        "risk_score": 0.36,
        "appointment_date": "2026-03-23",
        "appointment_time": "10:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 21,
        "patient_name": "Jack Harris",
        "age": 42,
        "past_no_shows": 0,
        "risk_score": 0.24,
        "appointment_date": "2026-03-27",
        "appointment_time": "11:30",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 22,
        "patient_name": "Ivy Garcia",
        "age": 62,
        "past_no_shows": 2,
        "risk_score": 0.77,
        "appointment_date": "2026-03-26",
        "appointment_time": "11:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 23,
        "patient_name": "Ursula Anderson",
        "age": 49,
        "past_no_shows": 5,
        "risk_score": 0.57,
        "appointment_date": "2026-03-24",
        "appointment_time": "10:00",
        "scan_type": "Long Scan",
        "duration": 60
    },
    {
        "id": 24,
        "patient_name": "Jack Garcia",
        "age": 27,
        "past_no_shows": 2,
        "risk_score": 0.3,
        "appointment_date": "2026-03-27",
        "appointment_time": "12:30",
        "scan_type": "Quick Scan",
        "duration": 30
    },
    {
        "id": 25,
        "patient_name": "Eve Anderson",
        "age": 67,
        "past_no_shows": 0,
        "risk_score": 0.07,
        "appointment_date": "2026-03-27",
        "appointment_time": "13:00",
        "scan_type": "Quick Scan",
        "duration": 30
    }
]
  );

  const handlePromote = (appointmentId: number) => {
    console.log(`Promoting patient to appointment ${appointmentId}`);
  };

  const renderContent = () => {
    if (currentView === 'Dashboard') {
      return (
        <Dashboard 
          appointments={appointments} 
          onPromote={handlePromote} 
          onViewCalendar={() => setCurrentView('Schedule')}
        />
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
