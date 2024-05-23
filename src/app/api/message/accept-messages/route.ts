import { database } from "@/database/db";
import User from "@/model/user.model";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Connect to the database
  await database();

  const userId = await verifyToken(request);

  if (!userId) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { acceptMessages } = await request.json();

  try {
    // Update the user's message acceptance status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isAcceptingMessage: acceptMessages } },
      { new: true }
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error updating message acceptance status" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Connect to the database
  await database();

  // Get the user session
  const userId = verifyToken(request);

  // Check if the user is authenticated
  if (!userId) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      // User not found
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
