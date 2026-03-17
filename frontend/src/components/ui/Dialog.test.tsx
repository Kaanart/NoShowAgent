import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dialog from './Dialog';

test('renders Dialog with title and children when isOpen is true', () => {
  render(
    <Dialog isOpen={true} onClose={() => {}} title="Test Dialog">
      <div>Dialog Content</div>
    </Dialog>
  );
  
  expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  expect(screen.getByText('Dialog Content')).toBeInTheDocument();
});

test('does not render Dialog when isOpen is false', () => {
  const { queryByText } = render(
    <Dialog isOpen={false} onClose={() => {}} title="Test Dialog">
      <div>Dialog Content</div>
    </Dialog>
  );
  
  expect(queryByText('Test Dialog')).not.toBeInTheDocument();
  expect(queryByText('Dialog Content')).not.toBeInTheDocument();
});

test('calls onClose when close button is clicked', () => {
  const handleClose = jest.fn();
  render(
    <Dialog isOpen={true} onClose={handleClose} title="Test Dialog">
      <div>Content</div>
    </Dialog>
  );
  
  const closeButton = screen.getByRole('button', { name: /close/i });
  fireEvent.click(closeButton);
  
  expect(handleClose).toHaveBeenCalledTimes(1);
});
