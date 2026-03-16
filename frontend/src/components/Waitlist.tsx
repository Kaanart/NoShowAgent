import React from 'react';

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
    <div className="waitlist">
      <h2>Waitlist Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Urgency</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.patient_name}</td>
              <td>{patient.urgency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Waitlist;
