const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/allergies', require('./routes/allergyRoutes'));
app.use('/api/vaccinations', require('./routes/vaccinationRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/vitals', require('./routes/vitalRoutes'));
app.use('/api/medicalevents', require('./routes/medicalEventRoutes'));

app.use("/api/access", require("./routes/accessRoutes"));


// A simple test route to check if the server is running
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the MedLog API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});