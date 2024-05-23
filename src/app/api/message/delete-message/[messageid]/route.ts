import { database } from "@/database/db";
import Message from "@/model/message.model";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/verifyToken";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  console.log(messageId);
  await database();
  const userId = await verifyToken(request);
  if (!userId) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    await Message.findByIdAndDelete(messageId);

    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log((error as Error).message);
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}
