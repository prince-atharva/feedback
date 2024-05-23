import { ApiResponse } from "@/Types/ApiResponse";
import { Resend } from "resend";
import { EmailTemplate } from "./EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "feedback <onboarding@resend.dev>",
      to: email,
      subject: "Verification Otp",
      text: "",
      react: EmailTemplate({ username, otp }),
    });

    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
