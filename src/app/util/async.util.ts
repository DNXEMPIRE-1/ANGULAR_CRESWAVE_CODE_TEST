import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AsyncUtil {
  static async delayHtmlRender(timeMs = 0): Promise<unknown> {
    return this.sleep(timeMs);
  }

  static async sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
