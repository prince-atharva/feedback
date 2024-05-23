import { database } from "@/database/db";
import Message from "@/model/message.model";
import { verifyToken } from "@/utils/verifyToken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await database();
  const userID = await verifyToken(request);

  if (!userID) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  try {
    const message = await Message.aggregate([
      {
        $match: {
          userID: new mongoose.Types.ObjectId(userID),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return Response.json(
      { success: true, data: message },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
