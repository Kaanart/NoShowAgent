import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      status: "success",
      original_appointment_id: 2,
      suggestions: [
        { id: "P888", name: "Bob Smith", distance: 3.4, match_score: 85.0 }
      ]
    }),
  })
) as jest.Mock;

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

test('opens backup selection dialog on Find a Backup click and displays suggestions', async () => {
  render(<App />);
  
  // Ensure the button is present (we know mock data has a high risk appointment)
  const promoteButtons = screen.getAllByText(/Find a Backup/i);
  expect(promoteButtons.length).toBeGreaterThan(0);
  
  // Click the first Find a Backup button
  fireEvent.click(promoteButtons[0]);
  
  // Wait for the dialog to appear
  await waitFor(() => {
    expect(screen.getByText(/Select Backup Patient/i)).toBeInTheDocument();
  });
  
  // Verify the mock suggestion is displayed
  expect(screen.getByText(/Bob Smith/i)).toBeInTheDocument();
  expect(screen.getByText(/85% Match/i)).toBeInTheDocument(); // match score
});
