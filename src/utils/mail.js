import nodemailer from "nodemailer"

/**
 * @function sendEmail
 * @description Sends an email
 * @param {Object} options
 * @returns {boolean}
 */
const sendEmail = async (options) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  // *Create a transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  const mail = {
    from: SMTP_USER,
    to: options.email,
    subject: options.subject,
    html: options.message,
  }

  try {
    // *Send the email
    await transporter.sendMail(mail)
    return true
  } catch (error) {
    return false
  }
}

export default sendEmail
