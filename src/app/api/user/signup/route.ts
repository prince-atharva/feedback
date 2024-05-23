import { database } from "@/database/db";
import User from "@/model/user.model";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await database();

  try {
    const { username, email, password } = await request.json();

    // existing user verified by username
    const existingUserByUsername = await User.findOne({
      username,
      isVerifyed: true,
    });

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // existing user (verified || unverified) by email
    const existingUserByEmail = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const verifyOtpExpiry = Date.now() + 600000;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerifyed) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyOTP = otp;
        existingUserByEmail.verifyOtpExpiry = new Date(verifyOtpExpiry);

        await existingUserByEmail.save();
      }
    } else {
      await User.create({
        username,
        email,
        password: hashPassword,
        verifyOTP: otp,
        verifyOtpExpiry,
      });
    }

    const emailResponse = await sendVerificationEmail(email, username, otp);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Register successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
