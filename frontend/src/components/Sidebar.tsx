import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen?: boolean; // for mobile toggle
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen = false }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
        <span>MedSchedule</span>
      </div>
      
      <nav className="sidebar-nav">
        <div 
          className={`nav-item ${currentView === 'Dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('Dashboard')}
        >
          <span className="material-symbols-outlined">dashboard</span>
          Daily Dashboard
        </div>
        
        <div 
          className={`nav-item ${currentView === 'Schedule' ? 'active' : ''}`}
          onClick={() => onViewChange('Schedule')}
        >
          <span className="material-symbols-outlined">calendar_month</span>
          Schedule
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="profile-avatar">JD</div>
        <div className="profile-info">
          <p className="profile-name">Dr. Jane Doe</p>
          <p className="profile-role">Lead Scheduler</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
