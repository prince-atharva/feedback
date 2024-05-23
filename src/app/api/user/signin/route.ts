import { database } from "@/database/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

type Data = {
  id: any;
  username: string;
};

export async function POST(reuest: Request) {
  try {
    await database();

    const { identifier, password } = await reuest.json();

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "email or username is not signup",
        },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      return Response.json(
        { success: false, message: "password is wrong" },
        { status: 400 }
      );
    }

    if (!user.isVerifyed) {
      return Response.json(
        {
          success: false,
          message: "Please verify your account before login",
        },
        { status: 400 }
      );
    }

    const token: Data = {
      id: user._id,
      username: user.username,
    };

    const accessToken = jwt.sign(token, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "login successfully",
      },
      { status: 200 }
    );

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });

    return response;
  } catch (error) {
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
