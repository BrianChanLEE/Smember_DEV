import { config } from "./../../middleware";
// lib/mailer.js

import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export async function sendVerificationEmail(to, code) {
  try {
    const transporter = nodemailer.createTransport({
      host: smtp.gmail.com,

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
    // return {
    //   success: true,
    //   message: "Email sent",
    // };
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent",
      })
    );
  } catch (error) {
    // return {
    //   success: false,
    //   message: error.message,
    // };
    // console.log("message :" + message);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      })
    );
  }
}
