import { Limiter } from "./interfaces/Limiter";
import { RateLimitResult } from "./models/RateLimitResult";
import { LimiterFactory } from "./factory/LimiterFactory.ts";

export class RateLimiter {
  private readonly limiters =
    new Map<string, Limiter>();

  private readonly defaultLimiter: Limiter;

  constructor(
    configs: Array<Record<string, any>>,
    defaultConfig: Record<string, any>
  ) {
    const factory =
      new LimiterFactory();

    for (const config of configs) {
      const endpoint =
        config.endpoint;

      if (!endpoint) {
        continue;
      }

      this.limiters.set(
        endpoint,
        factory.create(config)
      );
    }

    this.defaultLimiter =
      factory.create(defaultConfig);
  }

  allow(
    clientId: string,
    endpoint: string
  ): RateLimitResult {
    const limiter =
      this.limiters.get(endpoint) ??
      this.defaultLimiter;

    return limiter.allow(clientId);
  }
}