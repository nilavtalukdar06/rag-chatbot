import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UsageService } from "@/services/usage";

export async function GET() {
  try {
    const { has, userId, isAuthenticated } = await auth();
    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: "the user is not authenticated" },
        { status: 401 },
      );
    }
    const isPro = has({ plan: "pro" });
    if (isPro) {
      return NextResponse.json({
        isPro: true,
        used: 0,
        limit: Infinity,
        remaining: Infinity,
      });
    }
    const usage = await UsageService.canUpload(userId);
    return NextResponse.json({
      isPro: false,
      used: usage.used,
      limit: usage.limit,
      remaining: usage.remaining,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
