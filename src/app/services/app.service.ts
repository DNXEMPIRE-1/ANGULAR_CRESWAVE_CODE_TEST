import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, filter, map } from 'rxjs';
import { AsNonNullable } from '../models';
import { DateUtil } from '../util';
import { DateRangeValue } from '../shared/components/inputs/date-range-picker/date-range-form-group';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly defaultRange = {
    start: DateUtil.addWeeks(new Date(), -2),
    end: DateUtil.addWeeks(new Date(), 1),
  };

  private readonly initialDateString = DateUtil.formatDateToUniversalFormat(new Date());

  private _activeDateString$ = new BehaviorSubject<string>(this.initialDateString);
  private _dateRange$ = new BehaviorSubject<AsNonNullable<DateRangeValue> | null>(null);
  private _clearSessionState$ = new Subject<boolean>();

  get dateRange$() {
    return this._dateRange$
      .asObservable()
      .pipe(filter((dateRange): dateRange is AsNonNullable<DateRangeValue> => dateRange != null));
  }

  get dateRangeOrDefault$() {
    return this.dateRange$.pipe(map((dateRange) => dateRange ?? this.defaultRange));
  }

  get activeDateString$() {
    return this._activeDateString$.asObservable().pipe(
      filter((dateString) => !!dateString),
      map(DateUtil.dateTimeStringToDateString)
    );
  }

  get activeDate$() {
    return this.activeDateString$.pipe(map(DateUtil.dateStringToDate));
  }

  get clearSessionState$() {
    return this._clearSessionState$.asObservable();
  }

  getActiveDate(): Date {
    const activeDateString = this._activeDateString$.getValue();

    return DateUtil.dateStringToDate(activeDateString);
  }

  setActiveDate(value: Date | string): void {
    this._activeDateString$.next(
      typeof value === 'string' ? value : DateUtil.formatDateTimeToUniversalFormat(value)
    );
  }

  getDateRange() {
    return this._dateRange$.getValue();
  }

  getDateRangeOrDefault() {
    return this.getDateRange() ?? this.defaultRange;
  }

  setDateRange(value: AsNonNullable<DateRangeValue>): void {
    this._dateRange$.next(value);
  }

  /**
   * @returns true if the date range was not set before
   */
  initDateRange(): boolean {
    if (this.getDateRange() != null) return false;
    this.setDateRange(this.defaultRange);
    return true;
  }

  activateClearSessionState(): void {
    this._activeDateString$.next(this.initialDateString);
    this._dateRange$.next(null);

    this._clearSessionState$.next(true);
  }
}
