import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      {
        success: false,
        message: "logout successfully",
      },
      { status: 200 }
    );

    response.cookies.delete("accessToken");

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
