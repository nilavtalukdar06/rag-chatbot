import { RateLimiterMySQL } from "rate-limiter-flexible";
import { pool } from "@/db/db";
import { auth } from "@clerk/nextjs/server";

export const getUsageTracker = async () => {
  const { has } = await auth();
  const isPremiumUser = has({ plan: "pro_user" });
  return new RateLimiterMySQL({
    storeClient: pool,
    tableName: "usage",
    points: isPremiumUser ? 100 : 3,
    duration: 86400,
  });
};

export const consumeCredits = async (userId: string) => {
  const usageTracker = await getUsageTracker();
  const result = usageTracker.consume(userId, 1);
  return result;
};
