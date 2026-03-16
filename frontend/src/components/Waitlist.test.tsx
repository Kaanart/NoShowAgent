import React from 'react';
import { render, screen } from '@testing-library/react';
import Waitlist from './Waitlist';

const mockWaitlist = [
  { id: 101, patient_name: "John Doe", urgency: "high", requested_days: [1, 2] },
  { id: 102, patient_name: "Jane Smith", urgency: "medium", requested_days: [2, 3] },
];

test('renders waitlist with patients as suggested backups', () => {
  render(<Waitlist patients={mockWaitlist} />);
  expect(screen.getByText(/Suggested Backups/i)).toBeInTheDocument();
  expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  
  // Check for new structural elements (buttons)
  const callButtons = screen.getAllByText(/Call Now/i);
  expect(callButtons.length).toBeGreaterThan(0);
  
  const smsButtons = screen.getAllByText(/SMS/i);
  expect(smsButtons.length).toBeGreaterThan(0);
});
