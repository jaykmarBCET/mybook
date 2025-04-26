import nodemailer from "nodemailer";
import ENV from 'dotenv'
ENV.config()

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const SendMail = async ({ userEmail, url }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL}>`, // More readable sender
      to: userEmail,
      subject: "Verify Your Account",
      text: `Click the link to verify your account: ${url}`, // Fallback for plain email clients
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h3>Welcome to Our Platform 👋</h3>
          <p>Please click the button below to verify your account:</p>
          <a href="${url}" target="_blank" style="padding:10px 15px; background-color:#28a745; color:white; text-decoration:none; border-radius:5px;">Verify Account</a>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${url}</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};


export { SendMail };
