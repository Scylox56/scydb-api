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

// Send verification email
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationURL = `${process.env.FRONTEND_URL}/pages/auth/verify-link.html?token=${verificationToken}`;
  
  const message = `Welcome to ScyDB! Please verify your email address by clicking the link below:\n\n${verificationURL}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`;

  const html = `
    <div style="background-color:#F2F0E3; padding:40px 20px; font-family: Arial, sans-serif; color:#2E2E2E; text-align:center;">
      <div style="max-width:600px; margin:0 auto; background:#FFFFFF; border-radius:12px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
        
        <h1 style="color:#F76F53; margin-bottom:10px; font-size:28px;">Welcome to ScyDB!</h1>
        <p style="font-size:16px; color:#555; margin-bottom:30px;">
          Thanks for signing up, <strong>${user.name}</strong>!  
          Please verify your email address to start exploring movies.
        </p>

        <a href="${verificationURL}" 
           style="background-color:#F76F53; color:#FFFFFF; padding:14px 30px; border-radius:8px; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block; margin-bottom:25px;">
          Verify Email
        </a>

        <p style="font-size:14px; color:#777; margin-bottom:5px;">Or copy and paste this link into your browser:</p>
        <p style="word-break:break-all; font-size:14px; color:#F76F53; margin-bottom:30px;">
          ${verificationURL}
        </p>

        <p style="font-size:12px; color:#999;">
          This link will expire in 24 hours.  
          If you didn’t create an account, you can safely ignore this email.
        </p>
      </div>

      <div style="margin-top:30px; font-size:12px; color:#aaa;">
        &copy; ${new Date().getFullYear()} ScyDB. All rights reserved.
      </div>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'ScyDB - Verify Your Email Address',
    message,
    html
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetURL = `${process.env.FRONTEND_URL}/pages/auth/reset-password.html?token=${resetToken}`;
  
  const message = `Forgot your password? Click the link below to reset it:\n\n${resetURL}\n\nThis link will expire in 30 minutes.\n\nIf you didn't request this, please ignore this email.`;

  const html = `
    <div style="background-color:#F2F0E3; padding:40px 20px; font-family: Arial, sans-serif; color:#2E2E2E; text-align:center;">
      <div style="max-width:600px; margin:0 auto; background:#FFFFFF; border-radius:12px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
        
        <h1 style="color:#F76F53; margin-bottom:10px; font-size:28px;">Reset Your Password</h1>
        <p style="font-size:16px; color:#555; margin-bottom:30px;">
          Hi <strong>${user.name}</strong>,  
          We received a request to reset your password. Click the button below to create a new password.
        </p>

        <a href="${resetURL}" 
           style="background-color:#F76F53; color:#FFFFFF; padding:14px 30px; border-radius:8px; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block; margin-bottom:25px;">
          Reset Password
        </a>

        <p style="font-size:14px; color:#777; margin-bottom:5px;">Or copy and paste this link into your browser:</p>
        <p style="word-break:break-all; font-size:14px; color:#F76F53; margin-bottom:30px;">
          ${resetURL}
        </p>

        <p style="font-size:12px; color:#999;">
          This link will expire in 30 minutes.  
          If you didn't request this password reset, you can safely ignore this email.
        </p>
      </div>

      <div style="margin-top:30px; font-size:12px; color:#aaa;">
        &copy; ${new Date().getFullYear()} ScyDB. All rights reserved.
      </div>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'ScyDB - Reset Your Password',
    message,
    html
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };