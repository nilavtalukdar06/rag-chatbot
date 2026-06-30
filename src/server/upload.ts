"use server";

import { auth } from "@clerk/nextjs/server";
import { UsageService } from "@/services/usage";
import { PDFParse } from "pdf-parse";
import { EmbeddingService } from "@/services/embeddings";

export async function uploadPdf(formData: FormData) {
  const { has, userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    throw new Error("the user is not authenticated");
  }
  const file = formData.get("pdf") as File;
  if (!file) {
    throw new Error("file is not present in the request");
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  if (!data.text || data.text.trim().length === 0) {
    throw new Error("no text is present");
  }
  const isPro = has({ plan: "pro" });
  if (!isPro) {
    const usage = await UsageService.consumeChatCredit(userId);
    if (!usage.success) {
      throw new Error("Daily limit reached.");
    }
  }
  const result = await EmbeddingService.generateDocsEmbeddings(
    data.text,
    userId,
  );
  return {
    success: true,
    data: result,
  };
}
