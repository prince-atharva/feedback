import { database } from "@/database/db";
import User from "@/model/user.model";

export async function POST(request: Request) {
  await database();

  try {
    const { username, otp } = await request.json();

    const user = await User.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if otp is correct and not expired
    const isOtpValid = user.verifyOTP === otp;
    const isOtpNotExpired = new Date(user.verifyOtpExpiry) > new Date();

    if (isOtpValid && isOtpNotExpired) {
      user.isVerifyed = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isOtpNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification otp has expired. Please sign up again to get a new otp.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Incorrect verification otp" },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
