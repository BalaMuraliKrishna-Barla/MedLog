const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Appointment = require('../models/appointmentModel');
const Medication = require('../models/medicationModel');
const Profile = require('../models/profileModel'); // Import Profile model

// 1. Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 2. Email sending function for Appointments
const sendAppointmentReminderEmail = (user, appointment) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Reminder: Your Appointment Tomorrow`,
        html: `
            <p>Dear ${user.name},</p>
            <p>This is a reminder for your upcoming appointment:</p>
            <ul>
                <li><strong>Doctor:</strong> ${appointment.doctorName}</li>
                <li><strong>Purpose:</strong> ${appointment.purpose}</li>
                <li><strong>Date & Time:</strong> ${new Date(appointment.appointmentDateTime).toLocaleString()}</li>
                <li><strong>Location:</strong> ${appointment.location || 'N/A'}</li>
            </ul>
            <p>Thank you for using MedLog.</p>
        `,
    };

    console.log(`[EMAIL TRIGGERED] Attempting to send APPOINTMENT reminder to ${user.email} for Dr. ${appointment.doctorName}.`);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending appointment email to ${user.email}:`, error);
        } else {
            console.log(`Appointment reminder email sent successfully to ${user.email}`);
        }
    });
};

// 3. Email sending function for Medications
const sendMedicationReminderEmail = (user, medications) => {
    const medicationListHtml = medications.map(med => `<li><strong>${med.medicationName}</strong> (${med.dosage}, ${med.frequency})</li>`).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Your Daily Medication Reminder`,
        html: `
            <p>Dear ${user.name},</p>
            <p>This is your daily reminder to take the following medications:</p>
            <ul>
                ${medicationListHtml}
            </ul>
            <p>Please follow the prescribed frequency for each. Thank you for using MedLog.</p>
        `,
    };
    
    console.log(`[EMAIL TRIGGERED] Attempting to send MEDICATION reminder to ${user.email}.`);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending medication email to ${user.email}:`, error);
        } else {
            console.log(`Medication reminder email sent successfully to ${user.email}`);
        }
    });
};

// 4. THE FINAL CRON JOB LOGIC
const startScheduledJobs = () => {
    // Using 30-second interval for testing. Production should be '0 8 * * *'
    cron.schedule('*/30 * * * * *', async () => {
        const now = new Date();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        console.log(`\n--- Running Scheduled Jobs at ${now.toLocaleTimeString()} ---`);

        // --- Task 1: Check for Appointment Reminders (Stateful) ---
        try {
            const startOfTomorrow = new Date();
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
            startOfTomorrow.setHours(0, 0, 0, 0);
            const endOfTomorrow = new Date(startOfTomorrow);
            endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

            const upcomingAppointments = await Appointment.find({
                appointmentDateTime: { $gte: startOfTomorrow, $lt: endOfTomorrow },
                reminderSent: false,
            }).populate('user', 'name email');

            if (upcomingAppointments.length > 0) {
                upcomingAppointments.forEach(async (app) => {
                    if (app.user) {
                        sendAppointmentReminderEmail(app.user, app);
                        await Appointment.findByIdAndUpdate(app._id, { reminderSent: true });
                    }
                });
            }
        } catch (error) {
            console.error('Error checking for appointment reminders:', error);
        }

        // --- Task 2: Check for Daily Medication Reminders (Stateful) ---
        try {
            const userIdsWithActiveMeds = await Medication.distinct('user', {
                startDate: { $lte: now },
                $or: [{ endDate: null }, { endDate: { $gte: now } }],
            });

            if (userIdsWithActiveMeds.length > 0) {
                const profilesToRemind = await Profile.find({
                    user: { $in: userIdsWithActiveMeds },
                    $or: [
                        { medicationReminderLastSent: null },
                        { medicationReminderLastSent: { $lt: startOfToday } },
                    ],
                }).populate('user', 'name email');

                if (profilesToRemind.length > 0) {
                    console.log(`Found ${profilesToRemind.length} user(s) needing medication reminders.`);
                    for (const profile of profilesToRemind) {
                        const user = profile.user;
                        if (!user) continue;

                        const userMeds = await Medication.find({ user: user._id, startDate: { $lte: now }, $or: [{ endDate: null }, { endDate: { $gte: now } }] });
                        
                        if (userMeds.length > 0) {
                            sendMedicationReminderEmail(user, userMeds);
                            await Profile.updateOne({ _id: profile._id }, { medicationReminderLastSent: new Date() });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error checking for medication reminders:', error);
        }
    });

    console.log('Notification service started. Cron job scheduled to run every 30 seconds.');
};

module.exports = { startScheduledJobs };