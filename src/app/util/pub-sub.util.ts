import { Injectable } from '@angular/core';
import {
  Observable,
  Subject,
  Subscription,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  pairwise,
  startWith,
  takeUntil,
  tap,
} from 'rxjs';
import {
  DateRangeForm,
  DateRangeValue,
} from '../shared/components/inputs/date-range-picker/date-range-form-group';
import { FormGroup } from '@angular/forms';
import { AppService } from '../services';
import { AsNonNullable } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PubSubUtil {
  static unsub(subscriptions: Subscription[]): void {
    if (!subscriptions?.length) return;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  static completeDestroy(destroyed$: Subject<boolean>): void {
    destroyed$.next(true);
    destroyed$.complete();
  }

  static untilDestroyed<T>(source: Observable<T>, destroyed$: Subject<boolean>): Observable<T> {
    return source.pipe(takeUntil(destroyed$));
  }

  /**
   * Custom RxJS operator that ignores irrelevant date range changes
   *
   * The component emits { start: newDate, end: oldDate } and then { start: newDate, end: null } when a new date range is selected
   * So this ignores the date range change when a new date range selection starts
   */
  static ignoreIrrelevantDateRangeChanges() {
    return (source: Observable<Partial<DateRangeValue>>) =>
      source.pipe(
        pairwise(),
        filter(PubSubUtil.filterFromPair),
        map(([, curr]) => curr)
      );
  }

  static createAppDateRangeSub(
    range: FormGroup<DateRangeForm>,
    app: AppService,
    destroyed$: Subject<boolean>
  ) {
    return range.valueChanges
      .pipe(
        PubSubUtil.ignoreIrrelevantDateRangeChanges(),
        takeUntil(destroyed$),
        tap((value) => app.setDateRange(value as AsNonNullable<DateRangeValue>))
      )
      .subscribe();
  }

  private static filterFromPair<T extends Partial<DateRangeValue>>(pair: [T, T]) {
    const [prev, curr] = pair;
    if (!curr.start || !curr.end) return false;

    const isIrrelevantChange = !(prev.start && prev.end && curr.start && curr.end);
    return isIrrelevantChange;
  }

  static windowResize$(): Observable<number> {
    return fromEvent(window, 'resize').pipe(
      startWith(() => window.innerWidth),
      map(() => window.innerWidth)
    );
  }

  static isMobile$(): Observable<boolean> {
    return this.isInnerWidthLessThan$(768);
  }

  static isInnerWidthLessThan$(width: number): Observable<boolean> {
    return PubSubUtil.windowResize$().pipe(
      map(() => window.innerWidth <= width),
      distinctUntilChanged()
    );
  }
}
