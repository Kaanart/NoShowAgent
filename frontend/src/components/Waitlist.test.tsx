import React from 'react';
import { render, screen } from '@testing-library/react';
import Waitlist from './Waitlist';

const mockWaitlist = [
  { id: 101, patient_name: "John Doe", urgency: "high", requested_days: [1, 2] },
  { id: 102, patient_name: "Jane Smith", urgency: "medium", requested_days: [2, 3] },
];

test('renders waitlist with patients', () => {
  render(<Waitlist patients={mockWaitlist} />);
  expect(screen.getByText(/Waitlist Management/i)).toBeInTheDocument();
  expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  expect(screen.getByText(/high/i)).toBeInTheDocument();
});
