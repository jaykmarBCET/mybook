import { transporter } from "./SendMail.js";

export const SendOtp = async ({ userEmail, otp, message, subject }) => {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject,
        text: message,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
                <h2 style="color: #333;">OTP Verification</h2>
                <p style="color: #555;">${message}</p>
                <div style="background: #f3f3f3; padding: 10px; border-radius: 5px; text-align: center;">
                    <span style="font-size: 22px; font-weight: bold; color: #007bff;">${otp}</span>
                </div>
                <p style="color: #999; font-size: 12px;">This OTP is valid for 10 minutes.</p>
            </div>
        `,
    });
};
