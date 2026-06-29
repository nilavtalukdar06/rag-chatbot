import { RateLimiterMySQL } from "rate-limiter-flexible";
import { pool } from "@/db/db";

export const getUsageTracker = (plan: "free" | "pro") => {
  return new RateLimiterMySQL({
    storeClient: pool,
    tableName: "usage",
    points: plan === "pro" ? 100 : 3,
    duration: 86400,
  });
};

export const consumeCredits = async (userId: string, plan: "free" | "pro") => {
  const usageTracker = getUsageTracker(plan);
  const result = usageTracker.consume(userId, 1);
  return result;
};
