import { RateLimiter } from "./RateLimiter";

const configs = [
  {
    endpoint: "/login",
    algorithm: "TokenBucket",
    algoConfig: {
      capacity: 5,
      refillRatePerSecond: 1,
    },
  },

  {
    endpoint: "/products",
    algorithm: "SlidingWindowLog",
    algoConfig: {
      maxRequests: 3,
      windowMs: 10_000,
    },
  },
];

const defaultConfig = {
  algorithm: "TokenBucket",
  algoConfig: {
    capacity: 10,
    refillRatePerSecond: 2,
  },
};

const rateLimiter = new RateLimiter(
  configs,
  defaultConfig
);

console.log(
    rateLimiter.allow("user1", "/products")
  );
  
  console.log(
    rateLimiter.allow("user1", "/products")
  );
  
  console.log(
    rateLimiter.allow("user1", "/products")
  );
  
  console.log(
    rateLimiter.allow("user1", "/products")
  );