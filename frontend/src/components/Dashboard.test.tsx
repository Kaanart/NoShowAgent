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
  
  // Summary Metrics
  expect(screen.getByText(/No-Show Risk/i)).toBeInTheDocument();
  expect(screen.getByText(/Slots to Backfill/i)).toBeInTheDocument();
  expect(screen.getByText(/Utilization/i)).toBeInTheDocument();

  // New column headers
  const riskHeaders = screen.getAllByText(/RISK/i);
  expect(riskHeaders.length).toBeGreaterThan(0);
  expect(screen.getByText(/PATIENT NAME/i)).toBeInTheDocument();
  expect(screen.getByText(/SCAN TYPE/i)).toBeInTheDocument();
  expect(screen.getByText(/DATE & TIME/i)).toBeInTheDocument();
  expect(screen.getByText(/PREDICTION SCORE/i)).toBeInTheDocument();

  // Row content
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  expect(screen.getAllByText(/80%/i).length).toBeGreaterThan(0);
});

test('renders Find a Backup button only for high-risk appointments', () => {
  render(<Dashboard appointments={mockAppointments} onPromote={() => {}} />);
  const promoteButtons = screen.getAllByText(/Find a Backup/i);
  
  // Appt ID 2 is high risk (0.8), Appt ID 1 is low risk (0.1)
  // So there should be exactly one promote button.
  expect(promoteButtons).toHaveLength(1);
});
