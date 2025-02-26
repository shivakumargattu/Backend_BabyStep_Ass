const express = require('express');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const moment = require('moment');

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get available slots for a doctor on a specific date
router.get('/:id/slots', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date query parameter is required" });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const startHour = moment(`${date} ${doctor.workingHours.start}`, 'YYYY-MM-DD HH:mm');
    const endHour = moment(`${date} ${doctor.workingHours.end}`, 'YYYY-MM-DD HH:mm');
    const duration = 30; // Assuming appointments are 30 mins

    // Get booked appointments
    const bookedAppointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: startHour.toDate(),
        $lt: endHour.toDate()
      }
    });

    // Generate available time slots
    let availableSlots = [];
    let currentSlot = startHour.clone();

    while (currentSlot.isBefore(endHour)) {
      const isBooked = bookedAppointments.some(app =>
        moment(app.date).isSame(currentSlot, 'minute')
      );

      if (!isBooked) {
        availableSlots.push(currentSlot.format('HH:mm'));
      }

      currentSlot.add(duration, 'minutes');
    }

    res.status(200).json({ success: true, availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new doctor
router.post('/', async (req, res) => {
  try {
    const { name, specialization, workingHours } = req.body;

    if (!name || !specialization || !workingHours || !workingHours.start || !workingHours.end) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newDoctor = new Doctor({
      name,
      specialization,
      workingHours
    });

    await newDoctor.save();
    res.status(201).json({ success: true, data: newDoctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a doctor by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
