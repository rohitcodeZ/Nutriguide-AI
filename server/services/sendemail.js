
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "NutriGuide.ai OTP Verification",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>NutriGuide.ai</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    throw error;
  }
};

module.exports = { sendOTPEmail };

