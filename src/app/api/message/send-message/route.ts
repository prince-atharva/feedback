import { database } from "@/database/db";
import Message from "@/model/message.model";
import User from "@/model/user.model";

export async function POST(request: Request) {
  await database();
  const { username, content } = await request.json();

  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 } // 403 Forbidden status
      );
    }
    await Message.create({ userID: user._id, content, createdAt: new Date() });

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
