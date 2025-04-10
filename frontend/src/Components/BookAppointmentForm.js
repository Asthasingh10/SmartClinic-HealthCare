import React, { useState, useEffect } from 'react';
import '../Styles/Appointment.css';

const AppointmentForm = () => {
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [doctor, setDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [doctors, setDoctors] = useState([]); // To store doctors list

    useEffect(() => {
        // Fetch doctors' names from backend API
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/doctors');
                const data = await response.json();
                setDoctors(data); // Set the doctors in state
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        
        fetchDoctors(); // Call the function when component is mounted
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (patientName && patientEmail && doctor && appointmentDate && appointmentTime) {
            alert('Your appointment has been booked successfully!');
            console.log({
                patientName,
                patientEmail,
                doctor,
                appointmentDate,
                appointmentTime
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
