const nodemailer = require("nodemailer");


const sendEmail = async (email,title,body) => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to:email,
    subject:title,
    html:body,
  });

  console.log("Message sent:", info.messageId);
};

module.exports = sendEmail;