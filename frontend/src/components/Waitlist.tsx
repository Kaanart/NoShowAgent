import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface WaitlistPatient {
  id: number;
  patient_name: string;
  urgency: string;
  requested_days: number[];
}

interface WaitlistProps {
  patients: WaitlistPatient[];
}

const Waitlist: React.FC<WaitlistProps> = ({ patients }) => {
  return (
    <div className="waitlist" style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>Suggested Backups</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {patients.map((patient) => (
          <Card key={patient.id} style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{patient.patient_name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>ID: {patient.id}</p>
              </div>
              <span style={{
                fontSize: '0.75rem', 
                fontWeight: 500, 
                padding: '0.25rem 0.5rem', 
                borderRadius: '0.375rem',
                backgroundColor: patient.urgency === 'high' ? 'var(--status-high-risk-bg)' : 
                                 patient.urgency === 'medium' ? 'var(--status-medium-risk-bg)' : 
                                 'var(--status-low-risk-bg)',
                color: patient.urgency === 'high' ? 'var(--status-high-risk)' : 
                       patient.urgency === 'medium' ? 'var(--status-medium-risk)' : 
                       'var(--status-low-risk)'
              }}>
                {patient.urgency.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="primary" style={{ flex: 1 }}>Call Now</Button>
              <Button variant="secondary" style={{ flex: 1 }}>SMS</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Waitlist;
