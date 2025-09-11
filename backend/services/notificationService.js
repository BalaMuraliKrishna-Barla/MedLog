// REPLACE the entire backend/services/notificationService.js file

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Appointment = require("../models/appointmentModel");
const Medication = require("../models/medicationModel");
const User = require("../models/userModel"); // <-- THE CRITICAL MISSING IMPORT

// 1. Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Email sending function for Appointments with new template
const sendAppointmentReminderEmail = (user, appointment) => {
  const appointmentDate = new Date(
    appointment.appointmentDateTime
  ).toLocaleString();

  const mailOptions = {
    from: `MedLog <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `📅 Appointment Reminder: ${appointment.purpose} on ${new Date(
      appointment.appointmentDateTime
    ).toLocaleDateString()}`,
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f5fa; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="background-color: #1976D2; color: white; padding: 25px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">👨‍⚕️ Appointment Reminder</h1>
                    <p style="margin: 8px 0 0;">We’re here to keep your health on track</p>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hi <strong>${
                      user.name
                    }</strong>, 👋</p>
                    <p style="font-size: 16px; color: #333;">Just a quick reminder about your upcoming appointment:</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse; background-color: #fafafa; border-radius: 8px; overflow: hidden;">
                        <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 12px 15px;">👨‍⚕️ <strong>Doctor</strong></td><td style="padding: 12px 15px;">${
                          appointment.doctorName
                        }</td></tr>
                        <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 12px 15px;">📝 <strong>Purpose</strong></td><td style="padding: 12px 15px;">${
                          appointment.purpose
                        }</td></tr>
                        <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 12px 15px;">📆 <strong>Date & Time</strong></td><td style="padding: 12px 15px;">${appointmentDate}</td></tr>
                        <tr><td style="padding: 12px 15px;">📍 <strong>Location</strong></td><td style="padding: 12px 15px;">${
                          appointment.location || "N/A"
                        }</td></tr>
                    </table>
                    <p style="margin-top: 25px; font-size: 15px; color: #555;">🕑 Please arrive at least 10 minutes early and bring any relevant medical documents.</p>
                </div>
                <div style="background-color: #f0f0f0; text-align: center; padding: 20px; font-size: 13px; color: #777;">
                    <p style="margin: 0;">💙 Thank you for choosing <strong>MedLog</strong> — Your Health, Simplified.</p>
                    <p style="margin: 5px 0 0;">Need help? <a href="mailto:support@medlog.com" style="color: #1976D2;">Contact Support</a></p>
                </div>
            </div>
        </div>`,
  };

  console.log(
    `[EMAIL TRIGGERED] Attempting to send APPOINTMENT reminder to ${user.email} for Dr. ${appointment.doctorName}.`
  );
  transporter.sendMail(mailOptions, (error) => {
    if (error)
      console.error(`Error sending appointment email to ${user.email}:`, error);
    else
      console.log(
        `Appointment reminder email sent successfully to ${user.email}`
      );
  });
};

// 3. Email sending function for Medications with new template
const sendMedicationReminderEmail = (user, medications) => {
  const medicationListHtml = medications
    .ymap(
      (med) => `
        <tr>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">💊 <strong>${
              med.medicationName
            }</strong></td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">🧪 ${
              med.dosage
            }</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">⏰ ${med.frequency.timings.join(
              ", "
            )} (${med.instructions})</td>
        </tr>`
    )
    .join("");

  const mailOptions = {
    from: `MedLog <${process.env.EMAIL_USER}>`,
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
                                <th style="padding: 12px 15px;">Schedule</th>
                            </tr>
                        </thead>
                        <tbody>${medicationListHtml}</tbody>
                    </table>
                    <p style="margin-top: 30px; font-size: 15px; color: #555;">✅ Please take your medications as prescribed. If you have any questions, always consult your healthcare provider.</p>
                </div>
                <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #777;">
                    <p style="margin: 0;">💡 Stay consistent. Stay healthy. – <strong>MedLog</strong></p>
                    <p style="margin: 5px 0 0;">Need help? <a href="mailto:support@medlog.com" style="color: #4CAF50;">Contact support</a></p>
                </div>
            </div>
        </div>`,
  };

  console.log(
    `[EMAIL TRIGGERED] Attempting to send MEDICATION reminder to ${user.email}.`
  );
  transporter.sendMail(mailOptions, (error) => {
    if (error)
      console.error(`Error sending medication email to ${user.email}:`, error);
    else
      console.log(
        `Medication reminder email sent successfully to ${user.email}`
      );
  });
};

const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: `MedLog <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Verify Your Email with MedLog – One-Time Code Inside",
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f4f6f9; padding: 40px;">
      <div style="max-width: 550px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">

        <!-- Header -->
        <div style="background-color: #009879; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 26px;">🔐 Email Verification</h1>
          <p style="margin: 8px 0 0;">Secure Your MedLog Account</p>
        </div>

        <!-- Body -->
        <div style="padding: 35px 30px;">
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 16px; color: #333;">
            Use the verification code below to complete your registration or login to <strong>MedLog</strong>:
          </p>

          <div style="margin: 30px auto; width: fit-content; padding: 18px 30px; background-color: #f1f1f1; color: #2d2d2d; font-size: 30px; letter-spacing: 6px; font-weight: bold; border-radius: 10px; border: 2px dashed #009879;">
            ${otp}
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            ⏳ This code is valid for <strong>10 minutes</strong>.<br />
            If you didn’t request this, you can safely ignore this email.
          </p>

          <div style="text-align: center; margin-top: 40px;">
            <a href="#" style="text-decoration: none; background-color: #009879; color: white; padding: 12px 25px; border-radius: 6px; font-size: 16px;">
              ✅ Verify Now
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f0f0f0; text-align: center; padding: 20px; font-size: 13px; color: #888;">
          <p style="margin: 0;">🔒 Keeping your data secure is our priority – <strong>MedLog Security Team</strong></p>
          <p style="margin-top: 5px;">Need help? <a href="mailto:support@medlog.com" style="color: #009879;">Contact Support</a></p>
        </div>
      </div>
    </div>
    `,
  };

  console.log(`[EMAIL TRIGGERED] Attempting to send OTP to ${email}.`);
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(`Error sending OTP email to ${email}:`, error);
    } else {
      console.log(`OTP email sent successfully to ${email}`);
    }
  });
};


const startScheduledJobs = () => {
  // const cronSchedule = "0 8 * * * *";
  const cronSchedule = "*/30 * * * * *";

  cron.schedule(cronSchedule, async () => {
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    console.log(
      `\n--- Running Scheduled Jobs at ${now.toLocaleTimeString()} ---`
    );

    // --- Task 1: Appointment Reminders ---
    try {
      const startOfTomorrow = new Date();
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
      startOfTomorrow.setHours(0, 0, 0, 0);
      const endOfTomorrow = new Date(startOfTomorrow);
      endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
      const upcomingAppointments = await Appointment.find({
        appointmentDateTime: { $gte: startOfTomorrow, $lt: endOfTomorrow },
        reminderSent: false,
      }).populate("user", "name email");
      if (upcomingAppointments.length > 0) {
        console.log(
          `[Appointments] Found ${upcomingAppointments.length} upcoming appointments.`
        );
        for (const app of upcomingAppointments) {
          if (app.user) {
            sendAppointmentReminderEmail(app.user, app);
            await Appointment.findByIdAndUpdate(app._id, {
              reminderSent: true,
            });
          }
        }
      } else {
        console.log("[Appointments] No appointments found needing reminders.");
      }
    } catch (error) {
      console.error("[Appointments] Error checking for reminders:", error);
    }

    // --- Task 2: Medication Reminders (Stateless) ---
    try {
      const usersWithActiveMeds = await Medication.find({
        startDate: { $lte: now },
        $or: [{ endDate: null }, { endDate: { $gte: startOfToday } }],
      }).distinct("user");
      if (usersWithActiveMeds.length > 0) {
        console.log(
          `[Medications] Found ${usersWithActiveMeds.length} user(s) with active medications.`
        );
        for (const userId of usersWithActiveMeds) {
          const user = await User.findById(userId); // This now works because User is imported
          if (!user) continue;
          const userMeds = await Medication.find({
            user: userId,
            startDate: { $lte: now },
            $or: [{ endDate: null }, { endDate: { $gte: startOfToday } }],
          }).lean(); // Use .lean() for efficiency
          if (userMeds.length > 0) {
            sendMedicationReminderEmail(user, userMeds);
          }
        }
      } else {
        console.log("[Medications] No users with active medications found.");
      }
    } catch (error) {
      console.error("[Medications] Error sending reminders:", error);
    }
  });
  console.log(
    `Notification service started. Cron job scheduled to run: ${cronSchedule}.`
  );
};

module.exports = { startScheduledJobs, sendOtpEmail };
