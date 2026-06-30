import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UsageService } from "@/services/usage";
import { extractText } from "unpdf";
import { EmbeddingService } from "@/services/embeddings";

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
    const buffer = new Uint8Array(bytes);
    const { text: pages } = await extractText(buffer);
    const text = pages.join("\n");
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "no text is present" },
        { status: 400 },
      );
    }
    const isPro = has({ plan: "pro" });
    if (!isPro) {
      const usage = await UsageService.canUpload(userId);
      if (!usage.allowed) {
        return NextResponse.json(
          {
            error:
              "You have reached your free upload limit (3 documents). Upgrade to Pro for unlimited uploads.",
          },
          { status: 403 },
        );
      }
    }
    const result = await EmbeddingService.generateDocsEmbeddings(text, userId);
    const isPro2 = has({ plan: "pro" });
    if (!isPro2) {
      await UsageService.recordUpload(userId);
    }
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
