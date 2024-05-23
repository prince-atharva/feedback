import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { database } from "@/database/db";

export async function GET(request: NextRequest) {
  database();
  try {
    const userId = await verifyToken(request);

    const user = await User.findById(userId).select(
      "-password -__v -verifyOTP -verifyOtpExpiry"
    );
    request;
    if (!user) {
      return NextResponse.json({ message: "Invalid Token" }, { status: 400 });
    }

    return NextResponse.json({ messge: "user found", data: user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
