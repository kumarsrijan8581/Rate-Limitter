import { Limiter } from "../interfaces/Limiter";
import { RateLimitResult } from "../models/RateLimitResult";

class RequestLog {
  public readonly timestamps: number[] = [];
}

export class SlidingWindowLogLimiter
  implements Limiter
{
  private readonly logs =
    new Map<string, RequestLog>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {}

  allow(key: string): RateLimitResult {
    const log =
      this.getOrCreateLog(key);

    const now = Date.now();

    const cutoff =
      now - this.windowMs;

    while (
      log.timestamps.length > 0 &&
      log.timestamps[0] < cutoff
    ) {
      log.timestamps.shift();
    }

    if (
      log.timestamps.length <
      this.maxRequests
    ) {
      log.timestamps.push(now);

      const remaining =
        this.maxRequests -
        log.timestamps.length;

      return new RateLimitResult(
        true,
        remaining,
        null
      );
    }

    const oldestTimestamp =
      log.timestamps[0];

    const retryAfterMs =
      oldestTimestamp +
      this.windowMs -
      now;

    return new RateLimitResult(
      false,
      0,
      retryAfterMs
    );
  }

  private getOrCreateLog(
    key: string
  ): RequestLog {
    let log = this.logs.get(key);

    if (!log) {
      log = new RequestLog();
      this.logs.set(key, log);
    }

    return log;
  }
}