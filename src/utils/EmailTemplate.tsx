import * as React from "react";

interface EmailTemplateProps {
  username: string;
  otp: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  otp,
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p>Your OTP is: {otp}</p> {/* Display the OTP value */}
  </div>
);
