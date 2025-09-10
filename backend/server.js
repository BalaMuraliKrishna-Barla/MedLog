const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const { startScheduledJobs } = require('./services/notificationService');
const cors = require('cors');


// Connect to Database
connectDB();

startScheduledJobs();

const app = express();

app.use(cors());
// Middleware to parse JSON and urlencoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/allergies', require('./routes/allergyRoutes'));
app.use('/api/vaccinations', require('./routes/vaccinationRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/vitals', require('./routes/vitalRoutes'));
app.use('/api/medicalevents', require('./routes/medicalEventRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/customsections', require('./routes/customSectionRoutes'));
app.use("/api/access", require("./routes/accessRoutes"));


//Health Routes
app.use("/api/allergies", require("./routes/allergyRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/vaccinations", require("./routes/vaccinationRoutes"));
app.use("/api/medications", require("./routes/medicationRoutes"));
app.use("/api/vitals", require("./routes/vitalRoutes"));
app.use("/api/medicalevents", require("./routes/medicalEventRoutes"));


// A simple test route to check if the server is running
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the MedLog API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}✅`);
});