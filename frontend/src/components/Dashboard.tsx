import React from 'react';

interface Appointment {
  id: number;
  age: number;
  past_no_shows: number;
  risk_score: number;
}

interface DashboardProps {
  appointments: Appointment[];
  onPromote: (appointmentId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, onPromote }) => {
  return (
    <div className="dashboard">
      <h2>Risk Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>Risk</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>Appt ID: {appt.id}</td>
              <td>{appt.age}</td>
              <td>Risk: {Math.round(appt.risk_score * 100)}%</td>
              <td>
                {appt.risk_score > 0.5 && (
                  <button onClick={() => onPromote(appt.id)}>Auto-Promote</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
