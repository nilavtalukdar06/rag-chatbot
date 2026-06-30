import { RateLimiterMySQL } from "rate-limiter-flexible";
import { pool } from "@/db/db";

let _freeChatLimiter: RateLimiterMySQL | null = null;

export function getFreeChatLimiter(): RateLimiterMySQL {
  if (!_freeChatLimiter) {
    _freeChatLimiter = new RateLimiterMySQL({
      storeClient: pool,
      tableName: "rate_limiter",
      keyPrefix: "chat",
      points: 3,
      duration: 60 * 60 * 24,
    });
  }
  return _freeChatLimiter;
}
