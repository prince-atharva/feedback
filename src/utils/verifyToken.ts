import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const verifyToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("accessToken")?.value || "";
    const details: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    return details.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
