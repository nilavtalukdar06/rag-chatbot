"use server";

import { db } from "@/db/db";
import { messageTable } from "@/db/schema/schema";
import { ApiError } from "@/utils/error";
import { consumeCredits } from "@/utils/usage";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import StatusCodes from "http-status-codes";

export const createMessage = async (text: string) => {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, false, "unauthorized user");
  }
  if (!text) {
    throw new ApiError(StatusCodes.BAD_REQUEST, false, "prompt not found");
  }
  try {
    await consumeCredits(userId);
  } catch (error) {
    throw new ApiError(
      StatusCodes.PAYMENT_REQUIRED,
      false,
      "you have exceeded your prompt limit",
    );
  }
  const [result] = await db.insert(messageTable).values({
    type: "result",
    role: "user",
    content: text,
    userId,
  });
  return result;
};

export const gerMessages = async () => {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, false, "unauthorized user");
  }
  const [result] = await db
    .select()
    .from(messageTable)
    .where(eq(messageTable.userId, userId))
    .orderBy(desc(messageTable.createdAt));
  return result;
};

export const deleteMessages = async () => {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, false, "unauthorized user");
  }
  const [result] = await db
    .delete(messageTable)
    .where(eq(messageTable.userId, userId));
  return result;
};
