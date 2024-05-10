import { TestBed, inject } from '@angular/core/testing';
import { AsyncUtil } from '../async.util';

describe('Util: Async', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsyncUtil],
    });
  });

  it('should create', inject([AsyncUtil], (service: AsyncUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('sleep', () => {
    it('should resolve after the specified delay', async () => {
      const waitTime = 100;

      const startTime = Date.now();
      await AsyncUtil.sleep(waitTime);
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(waitTime);
    });
  });
});
