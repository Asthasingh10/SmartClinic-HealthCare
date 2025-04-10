import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Styles/Appointment.css';

const AppointmentForm = () => {
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [doctor, setDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [doctors, setDoctors] = useState([]); // To store doctors list
    const navigate = useNavigate(); // Hook to navigate between pages

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            // If user is not authenticated, redirect to login page
            alert("You need to log in to book an appointment");
            navigate('/login');
        } else {
            // If user is authenticated, fetch doctors list
            const fetchDoctors = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8080/doctors');
                    const data = await response.json();
                    setDoctors(data); // Set the doctors in state
                } catch (error) {
                    console.error('Error fetching doctors:', error);
                }
            };
            fetchDoctors(); // Fetch the doctors if user is logged in
        }
    }, [navigate]); // Depend on navigate to re-run if it's changed

    const handleSubmit = (e) => {
        e.preventDefault();
        if (patientName && patientEmail && doctor && appointmentDate && appointmentTime) {
            // Submit appointment to backend
            const appointmentData = {
                patientName,
                patientEmail,
                doctor,
                appointmentDate,
                appointmentTime,
            };
            fetch('http://127.0.0.1:8080/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Appointment booked successfully') {
                        alert('Your appointment has been booked successfully!');
                        navigate('/'); // Redirect to home page after success
                    } else {
                        alert('There was an issue booking the appointment. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error booking appointment:', error);
                    alert('An error occurred while booking the appointment.');
                });
        } else {
            alert('Please fill in all fields before submitting.');
        }
    };

    return (
        <div className="appointment-form-container">
            <h1>Book an Appointment</h1>
            <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-group">
                    <label htmlFor="patientName">Full Name:</label>
                    <input
                        type="text"
                        id="patientName"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="patientEmail">Email:</label>
                    <input
                        type="email"
                        id="patientEmail"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="doctor">Select Doctor:</label>
                    <select
                        id="doctor"
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        required
                    >
                        <option value="">--Select a Doctor--</option>
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.username}>
                                    {doctor.username}
                                </option>
                            ))
                        ) : (
                            <option disabled>No doctors available</option>
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appointmentDate">Appointment Date:</label>
                    <input
                        type="date"
                        id="appointmentDate"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="appointmentTime">Appointment Time:</label>
                    <input
                        type="time"
                        id="appointmentTime"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Book Appointment</button>
            </form>
        </div>
    );
};

export default AppointmentForm;
