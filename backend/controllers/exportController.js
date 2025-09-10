const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Allergy = require('../models/allergyModel');
const Medication = require('../models/medicationModel');
const Vaccination = require('../models/vaccinationModel');
const Vital = require('../models/vitalModel'); // Add this
const MedicalEvent = require('../models/medicalEventModel');

// @desc    Export user health records as PDF
// @route   GET /api/export/pdf
// @access  Private
const exportPdf = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch all data for the user. User is required, profile is optional.
        const [user, profile, allergies, medications, vaccinations] = await Promise.all([
            User.findById(userId).select('name email'),
            Profile.findOne({ user: userId }),
            Allergy.find({ user: userId }).sort({ createdAt: -1 }),
            Medication.find({ user: userId }).sort({ startDate: -1 }),
            Vaccination.find({ user: userId }).sort({ dateAdministered: -1 }),
        ]);

        if (!user) {
            // This case is highly unlikely for a logged-in user but is a good safeguard.
            res.status(404);
            throw new Error('User not found, cannot generate report.');
        }

        // 2. Prepare data for the template, handling optional profile info
        const reportData = {
            name: user.name,
            email: user.email,
            formattedDob: profile && profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A',
        };

        const formattedVaccinations = vaccinations.map(v => ({
            ...v._doc,
            formattedDate: new Date(v.dateAdministered).toLocaleDateString(),
        }));

        // 3. Load the HTML template
        const html = fs.readFileSync(path.join(__dirname, '../templates/healthReportTemplate.html'), 'utf8');

        // 4. Configure PDF options
        const options = { format: 'A4', orientation: 'portrait', border: '10mm' };

        const document = {
            html: html,
            data: {
                reportData: reportData,
                allergies: allergies,
                medications: medications,
                vaccinations: formattedVaccinations,
            },
            path: './report.pdf',
            type: 'buffer',
        };

        const pdfBuffer = await pdf.create(document, options);

        // 5. Send the PDF to the client
        const filename = `MedLog_Report_${user.name.replace(/\s/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF Export Error:', error);
        res.status(res.statusCode || 500).json({ message: 'Failed to generate PDF report.' });
    }
};


// @desc    Export all user data as JSON
// @route   GET /api/export/json
// @access  Private
const exportJson = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all records for the user in parallel for efficiency
        const [
            profile,
            allergies,
            medications,
            vaccinations,
            vitals,
            medicalEvents,
        ] = await Promise.all([
            Profile.findOne({ user: userId }).select('-__v -user'), // Exclude internal fields
            Allergy.find({ user: userId }).select('-__v -user'),
            Medication.find({ user: userId }).select('-__v -user'),
            Vaccination.find({ user: userId }).select('-__v -user'),
            Vital.find({ user: userId }).select('-__v -user'),
            MedicalEvent.find({ user: userId }).select('-__v -user'),
        ]);

        // Combine all data into a single JSON object
        const userBackup = {
            profile,
            allergies,
            medications,
            vaccinations,
            vitals,
            medicalEvents,
        };

        // Set headers to prompt a file download
        const filename = `MedLog_Backup_${req.user.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        
        res.status(200).json(userBackup);

    } catch (error) {
        console.error('JSON Export Error:', error);
        res.status(500).json({ message: 'Failed to generate JSON backup.' });
    }
};


module.exports = {
    exportPdf,
    exportJson,
};