import React from 'react';

interface Appointment {
  id: number;
  age: number;
  past_no_shows: number;
  risk_score: number;
}

interface DashboardProps {
  appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ appointments }) => {
  return (
    <div className="dashboard">
      <h2>Risk Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>Appt ID: {appt.id}</td>
              <td>{appt.age}</td>
              <td>Risk: {Math.round(appt.risk_score * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
