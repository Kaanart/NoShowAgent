import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header and dashboard', () => {
  render(<App />);
  const headerElement = screen.getByText(/MRI No-Show Prediction/i);
  expect(headerElement).toBeInTheDocument();
  expect(screen.getByText(/Risk Dashboard/i)).toBeInTheDocument();
});
