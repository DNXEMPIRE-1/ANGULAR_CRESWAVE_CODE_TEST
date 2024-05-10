import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { PubSubUtil } from '../pub-sub.util';

describe('Util: Rxjs', () => {
  let service: PubSubUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PubSubUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('unsub', () => {
    it('should not call unsubscribe on an empty array', () => {
      const spy = spyOn(Subscription.prototype, 'unsubscribe');
      PubSubUtil.unsub([]);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call unsubscribe on all subscriptions in the array', () => {
      const sub1 = new Subscription();
      const sub2 = new Subscription();
      const spy1 = spyOn(sub1, 'unsubscribe');
      const spy2 = spyOn(sub2, 'unsubscribe');
      PubSubUtil.unsub([sub1, sub2]);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });
});
