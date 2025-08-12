const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create transporter like gmail for example
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define email options
  const mailOptions = {
    from: 'ScyDB <loxru7111@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html 
  };

  // 3) send email
  await transporter.sendMail(mailOptions);
};

// NEW: Send verification email
const sendVerificationEmail = async (user, verificationToken) => {
const verificationURL = `${process.env.FRONTEND_URL}/pages/auth/verify-link.html?token=${verificationToken}`;
  
  const message = `Welcome to ScyDB! Please verify your email address by clicking the link below:\n\n${verificationURL}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to ScyDB!</h2>
      <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${verificationURL}" 
           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationURL}</p>
      
      <p style="color: #666; font-size: 14px;">
        This link will expire in 24 hours.<br>
        If you didn't create an account, please ignore this email.
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'ScyDB - Verify Your Email Address',
    message,
    html
  });
};

module.exports = { sendEmail, sendVerificationEmail };