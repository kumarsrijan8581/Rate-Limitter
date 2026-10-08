import { RateLimitResult } from "../models/RateLimitResult.ts";

export interface Limiter {
  allow(key: string): RateLimitResult;
}