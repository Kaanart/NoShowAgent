import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders main layout with Sidebar and Dashboard by default', () => {
  render(<App />);
  
  // Verify Sidebar renders
  expect(screen.getByText('MedSchedule')).toBeInTheDocument();
  
  // Verify default view is Daily Dashboard
  expect(screen.getByText(/One Day Outlook/i)).toBeInTheDocument();
});

test('toggles to Schedule view', () => {
  render(<App />);
  
  // Click the Schedule link in the Sidebar
  const scheduleLink = screen.getByText('Schedule');
  fireEvent.click(scheduleLink);
  
  // Verify Dashboard is gone and Schedule placeholder is present
  expect(screen.queryByText(/One Day Outlook/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Monday/i)).toBeInTheDocument(); // Checking for CalendarView
});
