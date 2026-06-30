import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UsageService } from "@/services/usage";
import { PDFParse } from "pdf-parse";
import { EmbeddingService } from "@/services/embeddings";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { has, userId, isAuthenticated } = await auth();
    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: "the user is not authenticated" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "file is not present in the request" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    if (!data.text || data.text.trim().length === 0) {
      return NextResponse.json(
        { error: "no text is present" },
        { status: 400 },
      );
    }

    const isPro = has({ plan: "pro" });
    if (!isPro) {
      const usage = await UsageService.consumeChatCredit(userId);
      if (!usage.success) {
        return NextResponse.json(
          { error: "Daily limit reached." },
          { status: 403 },
        );
      }
    }

    const result = await EmbeddingService.generateDocsEmbeddings(
      data.text,
      userId,
    );
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
