import { Limiter } from "../interfaces/Limiter";
import { TokenBucketLimiter } from "../algorithms/TokenBucketLimiter";
import { SlidingWindowLogLimiter } from "../algorithms/SlidingWindowLogLimiter";

export class LimiterFactory {
  create(
    config: Record<string, any>
  ): Limiter {
    const algorithm =
      config.algorithm;

    const algoConfig =
      config.algoConfig ?? {};

    switch (algorithm) {
      case "TokenBucket":
        return new TokenBucketLimiter(
          algoConfig.capacity ?? 0,
          algoConfig.refillRatePerSecond ?? 0
        );

      case "SlidingWindowLog":
        return new SlidingWindowLogLimiter(
          algoConfig.maxRequests ?? 0,
          algoConfig.windowMs ?? 0
        );

      default:
        throw new Error(
          `Unknown algorithm: ${algorithm}`
        );
    }
  }
}