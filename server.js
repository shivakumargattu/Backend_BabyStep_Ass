const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const doctorRoutes  =require("./routes/doctorRoutes")
const appointmentRoutes = require('./routes/appointmentRoutes');

const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
  

app.get('/', (req, res) => {
  res.send('Prenatal Appointment API is running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
