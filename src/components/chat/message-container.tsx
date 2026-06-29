"use client";

import { PromptInput } from "./prompt-input";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/elements/message";
import { MessageSquare } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/elements/conversation";
import { Shimmer } from "@/components/elements/shimmer";
import { useEffect } from "react";
import { getMessages } from "@/server/message";
import type { UIMessage } from "ai";

export interface ExtendedUIMessage extends UIMessage {
  metadata?: {
    type: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

type DBMessage = {
  id: number;
  type: string;
  role: "user" | "assistant" | "system";
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

function dbMessageToUIMessage(message: DBMessage): ExtendedUIMessage {
  return {
    id: message.id.toString(),
    role: message.role as "system" | "user" | "assistant",
    parts: [{ type: "text", text: message.content }],
    metadata: {
      type: message.type.toLowerCase(),
      userId: message.userId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    },
  };
}

export function MessageContainer() {
  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      return await getMessages();
    },
  });

  const {
    messages,
    sendMessage: sdkSendMessage,
    status,
    setMessages,
  } = useChat<ExtendedUIMessage>({
    id: "my-chat",
  });

  const sendMessage = (message: { text: string }) => {
    sdkSendMessage({
      role: "user",
      parts: [{ type: "text", text: message.text }],
    } as any);
  };

  useEffect(() => {
    if (data) {
      setMessages(
        data
          .map((message: any) => dbMessageToUIMessage(message as DBMessage))
          .reverse(),
      );
    }
  }, [data, setMessages]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Conversation className="flex-1 flex flex-col min-h-0">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="Start a conversation"
              description="Type a message below to begin chatting"
            />
          ) : (
            messages.map((message, index) => (
              <Message from={message.role} key={message.id || index}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <div
                          className="space-y-4"
                          key={`${message.id || index}-${i}`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex flex-col items-start justify-center gap-y-2">
                              <p className="text-muted-foreground text-xs font-light">
                                {new Intl.DateTimeFormat("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                }).format(
                                  message.metadata?.createdAt
                                    ? new Date(message.metadata.createdAt)
                                    : new Date(),
                                )}
                              </p>
                            </div>
                          )}
                          <MessageResponse>{part.text}</MessageResponse>
                        </div>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <div className="flex flex-col items-start justify-center gap-y-2">
              <Shimmer duration={1} className="font-light text-sm">
                Loading...
              </Shimmer>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-start justify-center gap-y-2">
              <p className="text-sm text-red-500 font-light">
                Failed to fulfill your request, please try again later.
              </p>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="relative px-4 py-3">
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-linear-to-b from-transparent via-background/60 to-background" />
        <PromptInput sendMessage={sendMessage} status={status} />
      </div>
    </div>
  );
}
