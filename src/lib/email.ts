import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: `"AMO Platform" <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a56db;">Welcome to AMO Platform!</h1>
        <p>Please use the following code to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <code style="font-size: 24px; letter-spacing: 4px;">${code}</code>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const mailOptions = {
    from: `"AMO Platform" <${process.env.SMTP_FROM}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${message}
        </div>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}