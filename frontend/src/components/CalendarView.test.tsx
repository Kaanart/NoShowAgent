import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarView from './CalendarView';

const mockAppointments = [
  { 
    id: 1, 
    patient_name: "Patient 1",
    age: 30, 
    risk_score: 0.1, 
    appointment_date: "2026-03-23", 
    appointment_time: "10:00" 
  },
];

test('renders calendar with weekdays only', () => {
  render(<CalendarView appointments={mockAppointments} onPromote={() => {}} />);
  expect(screen.getByText(/Monday/i)).toBeInTheDocument();
  expect(screen.getByText(/Tuesday/i)).toBeInTheDocument();
  expect(screen.getByText(/Wednesday/i)).toBeInTheDocument();
  expect(screen.getByText(/Thursday/i)).toBeInTheDocument();
  expect(screen.getByText(/Friday/i)).toBeInTheDocument();
  
  // Weekends should not be present
  expect(screen.queryByText(/Saturday/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Sunday/i)).not.toBeInTheDocument();
});

test('renders appointment in the calendar', () => {
  render(<CalendarView appointments={mockAppointments} onPromote={() => {}} />);
  expect(screen.getByText(/Patient 1/i)).toBeInTheDocument();
  // Using queryAllByText because 10:00 appears in the time gutter too
  const timeElements = screen.getAllByText(/10:00/i);
  expect(timeElements.length).toBeGreaterThanOrEqual(1);
});
