import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated } = await auth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const { messages }: { messages: UIMessage[] } = await request.json();
    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
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
