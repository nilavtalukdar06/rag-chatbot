"use server";

import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import StatusCodes from "http-status-codes";

import { db } from "@/db/db";
import { messageTable } from "@/db/schema/schema";
import { ApiError } from "@/utils/error";
import { consumeCredits } from "@/utils/usage";

async function getCurrentUserId() {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, false, "Unauthorized user");
  }
  return userId;
}

export async function createMessage(text: string) {
  const userId = await getCurrentUserId();
  const prompt = text.trim();
  if (!prompt) {
    throw new ApiError(StatusCodes.BAD_REQUEST, false, "Prompt is required");
  }
  try {
    await consumeCredits(userId);
    const result = await db.insert(messageTable).values({
      userId,
      role: "user",
      type: "result",
      content: prompt,
    });
    return result[0];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.PAYMENT_REQUIRED,
      false,
      "You have exceeded your prompt limit",
    );
  }
}

export async function getMessages() {
  const userId = await getCurrentUserId();
  const messages = await db
    .select()
    .from(messageTable)
    .where(eq(messageTable.userId, userId))
    .orderBy(desc(messageTable.createdAt));
  return messages;
}

export async function deleteMessages() {
  const userId = await getCurrentUserId();
  await db.delete(messageTable).where(eq(messageTable.userId, userId));
  return {
    success: true,
    message: "Messages deleted successfully",
  };
}
