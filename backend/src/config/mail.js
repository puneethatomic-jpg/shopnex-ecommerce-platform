const nodemailer = require('nodemailer');
const logger = require('./logger');

// For local/mock development, we use Ethereal or a mock logger transporter
let transporter;

if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Local development / Mock transporter
  transporter = {
    sendMail: async (mailOptions) => {
      logger.info(`[MOCK EMAIL SENT] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
      logger.debug(`[MOCK EMAIL BODY]:\n${mailOptions.text || mailOptions.html}`);
      return { messageId: `mock_${Date.now()}` };
    },
  };
}

module.exports = transporter;
