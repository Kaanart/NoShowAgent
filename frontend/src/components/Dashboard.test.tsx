import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

const mockAppointments = [
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
];

test('renders dashboard with summary metrics and calendar', () => {
  render(<Dashboard appointments={mockAppointments} onPromote={() => {}} />);
  
  // New heading
  expect(screen.getByText(/One Day Outlook/i)).toBeInTheDocument();
  
  // Summary Metrics
  expect(screen.getByText(/No-Show Risk/i)).toBeInTheDocument();
  expect(screen.getByText(/Slots to Backfill/i)).toBeInTheDocument();
  expect(screen.getByText(/Utilization/i)).toBeInTheDocument();

  // Calendar components still exist (now as table rows)
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText(/80%/i)).toBeInTheDocument();
});

test('renders Find a Backup button only for high-risk appointments', () => {
  render(<Dashboard appointments={mockAppointments} onPromote={() => {}} />);
  const promoteButtons = screen.getAllByText(/Find a Backup/i);
  
  // Appt ID 2 is high risk (0.8), Appt ID 1 is low risk (0.1)
  // So there should be exactly one promote button.
  expect(promoteButtons).toHaveLength(1);
});
