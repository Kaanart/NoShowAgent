import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentList from './AppointmentList';

// Mock the global fetch API
global.fetch = jest.fn();

describe('AppointmentList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('displays a loading message initially', () => {
    // Return a promise that doesn't resolve immediately
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<AppointmentList />);
    expect(screen.getByText(/loading appointments.../i)).toBeInTheDocument();
  });

  it('displays an error message if fetch fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch appointments/i)).toBeInTheDocument();
    });
  });

  it('renders a list of appointments when fetch is successful', async () => {
    const mockData = {
      appointments: [
        {
          id: 'A101',
          patient_id: 'P202',
          time: '2026-03-25T10:00:00Z',
          provider: 'DR01',
          type: 'Checkup',
          no_show_probability: 0.85,
          risk_level: 'High'
        }
      ]
    };
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText(/P202/)).toBeInTheDocument();
      expect(screen.getByText(/DR01/)).toBeInTheDocument();
      expect(screen.getByText(/Checkup/)).toBeInTheDocument();
      expect(screen.getByText(/85.0%/)).toBeInTheDocument();
    });
  });

  it('displays no appointments message when data is empty', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ appointments: [] }),
      })
    );
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no upcoming appointments found/i)).toBeInTheDocument();
    });
  });
});
