import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { messageTable } from "@/db/schema/schema";

export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const { messages }: { messages: UIMessage[] } = await request.json();
    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        await db.insert(messageTable).values({
          type: "result",
          role: "assistant",
          content: text,
          userId,
        });
      },
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
