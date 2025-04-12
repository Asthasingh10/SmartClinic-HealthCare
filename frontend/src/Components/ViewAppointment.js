import React, { useState, useEffect } from 'react';
import '../Styles/ViewAppointment.css';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://127.0.0.1:8080/viewappointments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h1 className="appointments-title">View Appointments</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt, index) => (
                <tr key={index}>
                  <td>{appt.patient_name}</td>
                  <td>{appt.doctor}</td>
                  <td>{appt.appointment_date}</td>
                  <td>{appt.appointment_time}</td>
                  <td>{appt.patient_email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAppointments;
