const express = require('express');
const Appointment = require('../models/Appointment');
const moment = require('moment');

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a single appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId');
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Create an appointment
router.post('/', async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;
    const appointmentDate = moment(date).toDate();

    // Check for conflicting appointment
    const existingAppointments = await Appointment.find({
      doctorId,
      date: appointmentDate
    });

    if (existingAppointments.length > 0) {
      return res.status(400).json({ success: false, message: 'Time slot already booked' });
    }

    const newAppointment = new Appointment({
      doctorId, date: appointmentDate, duration, appointmentType, patientName, notes
    });

    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
