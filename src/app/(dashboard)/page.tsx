"use client";

import { ApiResponse } from "@/Types/ApiResponse";
import { MessageCard } from "@/components/MessageCard";
import Navbar, { UserProfile } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/message.model";
import { AcceptMessageSchema } from "@/schemas/AcceptMessageSchema";
import { selectUser, setUser } from "@/store/slice/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagerefresh, setMessageRefresh] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const session = useSelector(selectUser);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<ApiResponse>("/api/user/me");
        dispatch(setUser(response.data.data));
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: axiosError.response?.data.message,
          variant: "destructive",
        });
      } finally {
      }
    })();
  }, []);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        "/api/message/accept-messages"
      );
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(
          "/api/message/get-messages"
        );
        setMessages(response.data.data || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast, messagerefresh]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/message/accept-messages",
        {
          acceptMessages: !acceptMessages,
        }
      );
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = session ? `${baseUrl}/feedback/${session.username}` : "";

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "URL Copied!",
        description: "Profile URL has been copied to clipboard.",
      });
    }
  };

  if (!session) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );
  } else {
    return (
      <>
        <Navbar username={session.username} />

        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Copy Your Unique Link
            </h2>{" "}
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>

          <div className="mb-4">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
          <Separator />

          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                  setMessageRefresh={setMessageRefresh}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default UserDashboard;
