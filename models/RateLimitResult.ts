export class RateLimitResult {
    constructor(
      private readonly allowed: boolean,
      private readonly remaining: number,
      private readonly retryAfterMs: number | null
    ) {}
  
    isAllowed(): boolean {
      return this.allowed;
    }
  
    getRemaining(): number {
      return this.remaining;
    }
  
    getRetryAfterMs(): number | null {
      return this.retryAfterMs;
    }
  }