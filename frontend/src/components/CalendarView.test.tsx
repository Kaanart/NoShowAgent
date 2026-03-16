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

test('renders calendar with days of the week', () => {
  render(<CalendarView appointments={mockAppointments} onPromote={() => {}} />);
  expect(screen.getByText(/Monday/i)).toBeInTheDocument();
  expect(screen.getByText(/Tuesday/i)).toBeInTheDocument();
  expect(screen.getByText(/Wednesday/i)).toBeInTheDocument();
  expect(screen.getByText(/Thursday/i)).toBeInTheDocument();
  expect(screen.getByText(/Friday/i)).toBeInTheDocument();
});

test('renders appointment in the calendar', () => {
  render(<CalendarView appointments={mockAppointments} onPromote={() => {}} />);
  expect(screen.getByText(/Patient 1/i)).toBeInTheDocument();
  expect(screen.getByText(/10:00/i)).toBeInTheDocument();
});
