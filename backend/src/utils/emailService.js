import nodemailer from 'nodemailer';
import process from 'node:process';

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
// eslint-disable-next-line no-unused-vars
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'Reset Your Password - Memorix',
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested to reset your password. Here is your reset code:</p>
        <h2 style="background-color: #f5f5f5; padding: 10px; text-align: center; font-family: monospace;">${resetToken}</h2>
        <p>Enter this code in the Memorix app to reset your password.</p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Memorix Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'Verify Your Email - Memorix',
      html: `
        <h1>Verify Your Email</h1>
        <p>Thank you for registering. Here is your verification code:</p>
        <h2 style="background-color: #f5f5f5; padding: 10px; text-align: center; font-family: monospace;">${code}</h2>
        <p>Enter this code in the Memorix app to verify your email.</p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't register, please ignore this email.</p>
        <p>Best regards,<br>Memorix Team</p>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Send verification email error:', error);
    throw error;
  }
};
