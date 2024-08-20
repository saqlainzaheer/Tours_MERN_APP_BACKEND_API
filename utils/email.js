import nodemailer from 'nodemailer';

// Configure the transporter with Mailtrap SMTP settings
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: '34f2152b117031', // Replace with your Mailtrap username
    pass: '57ae1e7c243b45', // Replace with your Mailtrap password
  },
});

// Function to send the password reset email
export const sendPasswordResetEmail = async (recipientEmail, resetToken) => {
  try {
    const resetUrl = `https://yourdomain.com/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"Support Team" <support@yourdomain.com>', // Sender address
      to: recipientEmail, // Recipient's email
      subject: 'Password Reset Request', // Subject line
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">Reset Password</a>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
  } catch (error) {
    console.error(`Failed to send password reset email: ${error.message}`);
    // You can rethrow the error or handle it according to your needs
    throw error;
  }
};

// Example usage
// const recipientEmail = 'user@example.com'; // The email address of the user requesting the reset
// const resetToken = 'your_reset_token_here'; // Generate a secure token for the reset

// // sendPasswordResetEmail(recipientEmail, resetToken)
// //   .then(() => console.log('Email sent successfully'))
// //   .catch((error) => console.error('Error sending email:', error));
