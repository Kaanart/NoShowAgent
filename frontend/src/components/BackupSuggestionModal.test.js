import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackupSuggestionModal from './BackupSuggestionModal';

// Mock the global fetch API
global.fetch = jest.fn();

describe('BackupSuggestionModal Component', () => {
  const mockAppointment = {
    id: 'A123',
    time: '2026-03-25T10:00:00Z',
    patient_id: 'P001'
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockOnClose.mockClear();
  });

  it('displays loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<BackupSuggestionModal appointment={mockAppointment} onClose={mockOnClose} />);
    expect(screen.getByText(/Triggering ADK Agent to find backups.../i)).toBeInTheDocument();
  });

  it('displays an error if fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    render(<BackupSuggestionModal appointment={mockAppointment} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('renders backup suggestions on successful fetch', async () => {
    const mockData = {
      suggestions: [
        { id: 'B1', name: 'John Doe', distance: 2.5, match_score: 95 },
        { id: 'B2', name: 'Jane Smith', distance: 5.0, match_score: 80 }
      ]
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    render(<BackupSuggestionModal appointment={mockAppointment} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });
  });

  it('displays empty state if no backups found', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ suggestions: [] }),
      })
    );

    render(<BackupSuggestionModal appointment={mockAppointment} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText(/No suitable backups found./i)).toBeInTheDocument();
    });
  });
});
