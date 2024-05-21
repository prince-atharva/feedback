import { database } from "@/database/db";
import User from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

export async function GET(request: Request) {
  await database();

  try {
    // params value
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const result = usernameValidation.safeParse(username);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const existUsername = await User.findOne({
      username: result.data,
      isVerifyed: true,
    });

    if (existUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
