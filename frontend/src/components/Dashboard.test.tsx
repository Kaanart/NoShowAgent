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
    appointment_date: "2026-03-23",
    appointment_time: "14:30"
  },
];

test('renders dashboard with summary metrics and redesigned table', () => {
  render(<Dashboard appointments={mockAppointments} onPromote={() => {}} />);
  
  // New heading
  expect(screen.getByText(/One Day Outlook/i)).toBeInTheDocument();
  
  // Summary Metrics (using specific text that distinguishes them)
  expect(screen.getByText(/Overall No-Show Risk/i)).toBeInTheDocument();
  expect(screen.getByText(/Slots to Backfill/i)).toBeInTheDocument();
  expect(screen.getByText(/Daily Utilization Rate/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Appointments/i)).toBeInTheDocument();

  // New column headers
  expect(screen.getByText('RISK')).toBeInTheDocument();
  expect(screen.getByText('PATIENT NAME')).toBeInTheDocument();
  expect(screen.getByText('SCAN TYPE')).toBeInTheDocument();
  expect(screen.getByText('DATE & TIME')).toBeInTheDocument();
  expect(screen.getByText('PREDICTION SCORE')).toBeInTheDocument();

  // Row content
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Jane Smith')).toBeInTheDocument();
});

test('renders Find a Backup button only for high-risk appointments', () => {
  render(<Dashboard appointments={mockAppointments} onPromote={() => {}} />);
  const promoteButtons = screen.getAllByText(/Find a Backup/i);
  
  // Appt ID 2 is high risk (0.8), Appt ID 1 is low risk (0.1)
  // So there should be exactly one promote button.
  expect(promoteButtons).toHaveLength(1);
});
