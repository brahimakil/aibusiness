type QueuedRequest = {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
};

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private requestDelay = 1000; // 1 second between requests

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        execute: request,
        resolve,
        reject,
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      
      try {
        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      // Wait before processing next request
      await new Promise(resolve => setTimeout(resolve, this.requestDelay));
    }

    this.processing = false;
  }
}

export const requestQueue = new RequestQueue(); 