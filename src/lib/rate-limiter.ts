export class RateLimiter {
  private queue: Promise<void> = Promise.resolve();
  private lastRequestTime: number = 0;
  private minInterval: number;

  constructor(requestsPerMinute: number) {
    this.minInterval = (60 * 1000) / requestsPerMinute;
  }

  async wait(): Promise<void> {
    this.queue = this.queue.then(async () => {
      const now = Date.now();
      const timeSinceLast = now - this.lastRequestTime;
      if (timeSinceLast < this.minInterval) {
        const delay = this.minInterval - timeSinceLast;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      this.lastRequestTime = Date.now();
    });
    return this.queue;
  }
}
