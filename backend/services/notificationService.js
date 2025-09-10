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
  const appointmentDate = new Date(
    appointment.appointmentDateTime
  ).toLocaleString();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `📅 Appointment Reminder: ${appointmentDate}`,
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f5fa; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background-color: #1976D2; color: white; padding: 25px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">👨‍⚕️ Appointment Reminder</h1>
                    <p style="margin: 8px 0 0;">We’re here to keep your health on track</p>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hi <strong>${
                      user.name
                    }</strong>, 👋</p>
                    <p style="font-size: 16px; color: #333;">Just a quick reminder about your upcoming appointment:</p>

                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse; background-color: #fafafa; border-radius: 8px; overflow: hidden;">
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 12px 15px;">👨‍⚕️ <strong>Doctor</strong></td>
                            <td style="padding: 12px 15px;">${
                              appointment.doctorName
                            }</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 12px 15px;">📝 <strong>Purpose</strong></td>
                            <td style="padding: 12px 15px;">${
                              appointment.purpose
                            }</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 12px 15px;">📆 <strong>Date & Time</strong></td>
                            <td style="padding: 12px 15px;">${appointmentDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 15px;">📍 <strong>Location</strong></td>
                            <td style="padding: 12px 15px;">${
                              appointment.location || "N/A"
                            }</td>
                        </tr>
                    </table>

                    <p style="margin-top: 25px; font-size: 15px; color: #555;">
                        🕑 Please arrive at least 10 minutes early and bring any relevant medical documents.
                    </p>

                    <div style="text-align: center; margin-top: 35px;">
                        <a href="#" style="background-color: #1976D2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                            📍 View Appointment Details
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f0f0f0; text-align: center; padding: 20px; font-size: 13px; color: #777;">
                    <p style="margin: 0;">💙 Thank you for choosing <strong>MedLog</strong> — Your Health, Simplified.</p>
                    <p style="margin: 5px 0 0;">Need help? <a href="mailto:support@medlog.com" style="color: #1976D2;">Contact Support</a></p>
                </div>
            </div>
        </div>
        `,
  };

  console.log(
    `[EMAIL TRIGGERED] Attempting to send APPOINTMENT reminder to ${user.email} for Dr. ${appointment.doctorName}.`
  );
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending appointment email to ${user.email}:`, error);
    } else {
      console.log(
        `Appointment reminder email sent successfully to ${user.email}`
      );
    }
  });
};


// 3. Email sending function for Medications
const sendMedicationReminderEmail = (user, medications) => {
  const medicationListHtml = medications
    .map(
      (med) => `
        <tr>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">
                💊 <strong>${med.medicationName}</strong>
            </td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">
                🧪 ${med.dosage}
            </td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">
                ⏰ ${med.frequency}
            </td>
        </tr>
    `
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "💊 Your Daily Medication Reminder | MedLog",
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="background-color: #4CAF50; color: white; padding: 20px 30px; text-align: center;">
                    <h1 style="margin: 0;">🌿 MedLog</h1>
                    <p style="margin: 5px 0 0;">Your Daily Wellness Partner</p>
                </div>

                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hello <strong>${user.name}</strong>, 👋</p>
                    <p style="font-size: 16px; color: #333;">This is your friendly reminder to take the following medications today:</p>

                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fafafa;">
                        <thead>
                            <tr style="background-color: #e8f5e9; text-align: left;">
                                <th style="padding: 12px 15px;">Medication</th>
                                <th style="padding: 12px 15px;">Dosage</th>
                                <th style="padding: 12px 15px;">Frequency</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${medicationListHtml}
                        </tbody>
                    </table>

                    <p style="margin-top: 30px; font-size: 15px; color: #555;">
                        ✅ Please take your medications as prescribed. If you have any questions, always consult your healthcare provider.
                    </p>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            📅 View My Schedule
                        </a>
                    </div>
                </div>

                <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #777;">
                    <p style="margin: 0;">💡 Stay consistent. Stay healthy. – <strong>MedLog</strong></p>
                    <p style="margin: 5px 0 0;">Need help? <a href="mailto:support@medlog.com" style="color: #4CAF50;">Contact support</a></p>
                </div>
            </div>
        </div>
        `,
  };

  console.log(
    `[EMAIL TRIGGERED] Attempting to send MEDICATION reminder to ${user.email}.`
  );
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending medication email to ${user.email}:`, error);
    } else {
      console.log(
        `Medication reminder email sent successfully to ${user.email}`
      );
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