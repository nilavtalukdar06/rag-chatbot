import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { messageTable } from "@/db/schema/schema";
import StatusCodes from "http-status-codes";
import { generateSystemPrompt } from "@/lib/system-prompt";
import { EmbeddingService } from "@/services/embeddings";

export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated || !userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const { messages }: { messages: UIMessage[] } = await request.json();

    const latestMessage = messages[messages.length - 1];
    const query = latestMessage.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("")
      .trim();
    const docs = await EmbeddingService.getVectorStore(query, userId);
    const context = docs.map((doc) => doc.pageContent).join("\n\n");

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: generateSystemPrompt(context),
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
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
