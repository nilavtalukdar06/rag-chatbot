import { RateLimiterMySQL } from "rate-limiter-flexible";
import { pool } from "@/db/db";

export const freeChatLimiter = new RateLimiterMySQL({
  storeClient: pool,
  tableName: "rate_limiter",
  keyPrefix: "chat",
  points: 3,
  duration: 60 * 60 * 24,
});
