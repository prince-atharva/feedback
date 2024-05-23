"use client";

import React from "react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { ApiResponse } from "@/Types/ApiResponse";
import { useRouter } from "next/navigation";
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessage: boolean;
}

const Navbar = ({ username }: any) => {
  const { toast } = useToast();
  const router = useRouter();

  const logout = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/user/logout");
      router.push("/signin");
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      alert("hii");
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Logout Failed",
        description: axiosError.response?.data.message,
      });
    }
  };
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 md:mb-0">True Feedback</div>
        <span className="mr-4">Welcome, {username}</span>
        <Button
          onClick={logout}
          className="w-full md:w-auto bg-slate-100 text-black"
          variant="outline"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
