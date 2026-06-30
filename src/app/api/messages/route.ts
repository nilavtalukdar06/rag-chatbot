import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import { messageTable } from "@/db/schema/schema";

async function getCurrentUserId() {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    throw new Error("Unauthorized user");
  }
  return userId;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const messages = await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.userId, userId))
      .orderBy(desc(messageTable.createdAt));
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const { text } = await req.json();
    const prompt = text?.trim();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }
    const result = await db.insert(messageTable).values({
      userId,
      role: "user",
      type: "result",
      content: prompt,
    });
    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    const userId = await getCurrentUserId();
    await db.delete(messageTable).where(eq(messageTable.userId, userId));
    return NextResponse.json({
      success: true,
      message: "Messages deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
