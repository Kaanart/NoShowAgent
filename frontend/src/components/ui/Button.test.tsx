import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with children', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
});

test('handles onClick event', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Submit</Button>);
  const button = screen.getByText(/Submit/i);
  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('applies variant classes correctly', () => {
  const { container } = render(<Button variant="primary">Primary</Button>);
  expect(container.firstChild).toHaveClass('btn');
  expect(container.firstChild).toHaveClass('btn-primary');
});
