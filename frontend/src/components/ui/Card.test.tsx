import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

test('renders card with children', () => {
  render(<Card>Card Content</Card>);
  expect(screen.getByText(/Card Content/i)).toBeInTheDocument();
});

test('applies custom className', () => {
  const { container } = render(<Card className="custom-class">Content</Card>);
  expect(container.firstChild).toHaveClass('card');
  expect(container.firstChild).toHaveClass('custom-class');
});
