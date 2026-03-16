import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

test('renders Sidebar with all elements', () => {
  render(<Sidebar currentView="Dashboard" onViewChange={() => {}} />);
  
  // Branding
  expect(screen.getByText('MedSchedule')).toBeInTheDocument();
  
  // Navigation Links
  expect(screen.getByText('Daily Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Schedule')).toBeInTheDocument();
  
  // Profile Placeholder
  expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument();
  expect(screen.getByText('Lead Scheduler')).toBeInTheDocument();
});

test('handles navigation click', () => {
  const mockOnViewChange = jest.fn();
  render(<Sidebar currentView="Dashboard" onViewChange={mockOnViewChange} />);
  
  const scheduleLink = screen.getByText('Schedule');
  fireEvent.click(scheduleLink);
  
  expect(mockOnViewChange).toHaveBeenCalledWith('Schedule');
});

test('applies active class based on currentView prop', () => {
  const { rerender } = render(<Sidebar currentView="Dashboard" onViewChange={() => {}} />);
  
  const dashboardItem = screen.getByText('Daily Dashboard').closest('div.nav-item');
  expect(dashboardItem).toHaveClass('active');
  
  rerender(<Sidebar currentView="Schedule" onViewChange={() => {}} />);
  const scheduleItem = screen.getByText('Schedule').closest('div.nav-item');
  expect(scheduleItem).toHaveClass('active');
});

