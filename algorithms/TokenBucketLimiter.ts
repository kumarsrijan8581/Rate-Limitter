import { Limiter } from "../interfaces/Limiter";
import { RateLimitResult } from "../models/RateLimitResult";

class TokenBucket {
  constructor(
    public tokens: number,
    public lastRefillTime: number
  ) {}
}

export class TokenBucketLimiter implements Limiter {
  private readonly buckets =
    new Map<string, TokenBucket>();

  constructor(
    private readonly capacity: number,
    private readonly refillRatePerSecond: number
  ) {}

  allow(key: string): RateLimitResult {
    const bucket = this.getOrCreateBucket(key);

    const now = Date.now();

    const elapsed =
      now - bucket.lastRefillTime;

    const tokensToAdd =
      (elapsed * this.refillRatePerSecond) / 1000;

    bucket.tokens = Math.min(
      this.capacity,
      bucket.tokens + tokensToAdd
    );

    bucket.lastRefillTime = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;

      return new RateLimitResult(
        true,
        Math.floor(bucket.tokens),
        null
      );
    }

    const tokensNeeded =
      1 - bucket.tokens;

    const retryAfterMs = Math.ceil(
      (tokensNeeded * 1000) /
        this.refillRatePerSecond
    );

    return new RateLimitResult(
      false,
      0,
      retryAfterMs
    );
  }

  private getOrCreateBucket(
    key: string
  ): TokenBucket {
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = new TokenBucket(
        this.capacity,
        Date.now()
      );

      this.buckets.set(key, bucket);
    }

    return bucket;
  }
}