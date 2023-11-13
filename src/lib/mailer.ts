import { config } from "./../../middleware";
// lib/mailer.js

import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export async function sendVerificationEmail(to, code) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.SMT_PWD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_ID,
    to: to,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
}
