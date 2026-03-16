import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

const mockAppointments = [
  { id: 1, age: 30, past_no_shows: 0, risk_score: 0.1 },
  { id: 2, age: 25, past_no_shows: 5, risk_score: 0.8 },
];

test('renders dashboard with appointments', () => {
  render(<Dashboard appointments={mockAppointments} onPromote={() => {}} />);
  expect(screen.getByText(/Risk Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Appt ID: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Appt ID: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/Risk: 80%/i)).toBeInTheDocument();
});

test('renders Auto-Promote button only for high-risk appointments', () => {
  render(<Dashboard appointments={mockAppointments} onPromote={() => {}} />);
  const promoteButtons = screen.getAllByText(/Auto-Promote/i);
  
  // Appt ID 2 is high risk (0.8), Appt ID 1 is low risk (0.1)
  // So there should be exactly one promote button.
  expect(promoteButtons).toHaveLength(1);
});
