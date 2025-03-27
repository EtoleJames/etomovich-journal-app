import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.ethereal.email or your SMTP server
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password
  },
});

export async function sendResetPasswordEmail(email: string, resetLink: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM, // sender address
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}
