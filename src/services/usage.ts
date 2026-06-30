import { getFreeChatLimiter } from "@/lib/rate-limit";

export abstract class UsageService {
  constructor() {}
  static async consumeChatCredit(userId: string) {
    try {
      const result = await getFreeChatLimiter().consume(userId);
      return {
        success: true,
        remainingPoints: result.remainingPoints,
        consumedPoints: result.consumedPoints,
        msBeforeNext: result.msBeforeNext,
      };
    } catch (rejRes: any) {
      return {
        success: false,
        remainingPoints: 0,
        consumedPoints: 3,
        msBeforeNext: rejRes.msBeforeNext,
      };
    }
  }
  static async getChatUsage(userId: string) {
    const result = await getFreeChatLimiter().get(userId);
    if (!result) {
      return {
        used: 0,
        remaining: 3,
        total: 3,
        msBeforeNext: 0,
      };
    }
    return {
      used: result.consumedPoints,
      remaining: result.remainingPoints,
      total: 3,
      msBeforeNext: result.msBeforeNext,
    };
  }
}
