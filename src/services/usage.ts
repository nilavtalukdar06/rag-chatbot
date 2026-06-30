import { db } from "@/db/db";
import { documentUploadTable } from "@/db/schema/schema";
import { eq, count } from "drizzle-orm";

const FREE_UPLOAD_LIMIT = 3;

export abstract class UsageService {
  constructor() {}
  static async getUploadCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ total: count() })
      .from(documentUploadTable)
      .where(eq(documentUploadTable.userId, userId));
    return result?.total ?? 0;
  }
  static async canUpload(userId: string): Promise<{
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
  }> {
    const used = await this.getUploadCount(userId);
    const remaining = Math.max(0, FREE_UPLOAD_LIMIT - used);
    return {
      allowed: used < FREE_UPLOAD_LIMIT,
      used,
      limit: FREE_UPLOAD_LIMIT,
      remaining,
    };
  }

  static async recordUpload(userId: string) {
    await db.insert(documentUploadTable).values({ userId });
  }
}
