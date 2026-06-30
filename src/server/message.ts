"use server";

import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import { messageTable } from "@/db/schema/schema";
import { UsageService } from "@/services/usage";

async function getCurrentUserId() {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    throw new Error("Unauthorized user");
  }
  return userId;
}

export async function createMessage(text: string) {
  const { has } = await auth();
  const userId = await getCurrentUserId();
  const prompt = text.trim();
  if (!prompt) {
    throw new Error("Prompt is required");
  }
  const isPro = has({ plan: "pro" });
  if (!isPro) {
    const usage = await UsageService.consumeChatCredit(userId);
    if (!usage.success) {
      throw new Error("Daily limit reached.");
    }
  }
  const result = await db.insert(messageTable).values({
    userId,
    role: "user",
    type: "result",
    content: prompt,
  });
  return JSON.parse(JSON.stringify(result[0]));
}

export async function getMessages() {
  const userId = await getCurrentUserId();
  const messages = await db
    .select()
    .from(messageTable)
    .where(eq(messageTable.userId, userId))
    .orderBy(desc(messageTable.createdAt));
  return JSON.parse(JSON.stringify(messages));
}

export async function deleteMessages() {
  const userId = await getCurrentUserId();
  await db.delete(messageTable).where(eq(messageTable.userId, userId));
  return {
    success: true,
    message: "Messages deleted successfully",
  };
}
