import { TestBed, inject } from '@angular/core/testing';
import { DateUtil } from '../date.util';
import { DateValues, DaysOfWeek } from 'src/app/models';
import { WeekDay } from '@angular/common';

describe('Util: Date', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateUtil],
    });
  });

  it('should create', inject([DateUtil], (service: DateUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('formatDateToUniversalFormat', () => {
    it('should return an empty string when given a falsy value', () => {
      expect(DateUtil.formatDateToUniversalFormat(null as unknown as Date)).toEqual('');
      expect(DateUtil.formatDateToUniversalFormat(undefined as unknown as Date)).toEqual('');
    });

    it('should format a date correctly', () => {
      const date = new Date(2023, 3, 21);
      expect(DateUtil.formatDateToUniversalFormat(date)).toEqual('2023-04-21');
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 3, 21, 12, 0, 0, 0);
      DateUtil.formatDateToUniversalFormat(date);
      expect(date).toEqual(new Date(2023, 3, 21, 12, 0, 0, 0));
    });
  });

  describe('toDayOfWeek', () => {
    it('should return the day of the week', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtil.toDayOfWeek(date.getDay())).toEqual('Mon');
    });

    it('should return an empty string when given a falsy value', () => {
      expect(DateUtil.toDayOfWeek(null as unknown as number)).toEqual('');
      expect(DateUtil.toDayOfWeek(undefined as unknown as number)).toEqual('');
    });
  });

  describe('addDays', () => {
    it('should return the date with the added days', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtil.addDays(date, 1)).toEqual(new Date(2023, 4, 2));
    });

    it('should move to the next month', () => {
      const date = new Date(2023, 4, 31);
      expect(DateUtil.addDays(date, 1)).toEqual(new Date(2023, 5, 1));
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 4, 1);
      DateUtil.addDays(date, 1);
      expect(date).toEqual(new Date(2023, 4, 1));
    });
  });

  describe('addMonths', () => {
    it('should return the date with the added months', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtil.addMonths(date, 1)).toEqual(new Date(2023, 5, 1));
    });

    it('should move to the next year', () => {
      const date = new Date(2023, 11, 1);
      expect(DateUtil.addMonths(date, 1)).toEqual(new Date(2024, 0, 1));
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 4, 1);
      DateUtil.addMonths(date, 1);
      expect(date).toEqual(new Date(2023, 4, 1));
    });
  });

  describe('addWeeks', () => {
    it('should return the date with the added weeks', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtil.addWeeks(date, 1)).toEqual(new Date(2023, 4, 8));
    });

    it('should move to the next month', () => {
      const date = new Date(2023, 4, 31);
      expect(DateUtil.addWeeks(date, 1)).toEqual(new Date(2023, 5, 7));
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 4, 1);
      DateUtil.addWeeks(date, 1);
      expect(date).toEqual(new Date(2023, 4, 1));
    });
  });
  describe('formatDay', () => {
    it('should return the day with a leading zero', () => {
      expect(DateUtil.formatDay(new Date(2023, 4, 1))).toEqual('01');
      expect(DateUtil.formatDay(new Date(2023, 4, 20))).toEqual('20');
    });

    it('should return an empty string when given a falsy value', () => {
      expect(DateUtil.formatDay(null as unknown as Date)).toEqual('');
      expect(DateUtil.formatDay(null as unknown as Date)).toEqual('');
    });
  });

  describe('daysDiff', () => {
    it('should return the number of days between two dates', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 2);
      expect(DateUtil.daysDiff(date1, date2)).toEqual(1);
    });

    it('should not return a negative number when the first date is after the second date', () => {
      const date1 = new Date(2023, 4, 2);
      const date2 = new Date(2023, 4, 1);
      expect(DateUtil.daysDiff(date1, date2)).toEqual(1);
    });

    it('should return zero when the dates are the same', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 1);
      expect(DateUtil.daysDiff(date1, date2)).toEqual(0);
    });

    it('should not modify the original dates', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 2);
      DateUtil.daysDiff(date1, date2);
      expect(date1).toEqual(new Date(2023, 4, 1));
      expect(date2).toEqual(new Date(2023, 4, 2));
    });
  });

  describe('datesEqual', () => {
    it('should return true when the dates are equal', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 1);
      expect(DateUtil.datesEqual(date1, date2)).toBeTrue();
    });

    it('should return false when the dates are not equal', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 2);
      expect(DateUtil.datesEqual(date1, date2)).toBeFalse();
    });

    it('should not modify the original dates', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 1);
      DateUtil.datesEqual(date1, date2);
      expect(date1).toEqual(new Date(2023, 4, 1));
      expect(date2).toEqual(new Date(2023, 4, 1));
    });
  });

  describe('isWeekend', () => {
    it('should return true when the day index is a weekend', () => {
      expect(DateUtil.isWeekend(WeekDay.Saturday)).toBeTrue();
      expect(DateUtil.isWeekend(WeekDay.Sunday)).toBeTrue();
    });

    it('should return false when the day index is not a weekend', () => {
      expect(DateUtil.isWeekend(WeekDay.Thursday)).toBeFalse();
      expect(DateUtil.isWeekend(WeekDay.Friday)).toBeFalse();
    });
  });

  describe('getDateValues', () => {
    it('should return the date values', () => {
      const expectedResult: DateValues = {
        day: '01',
        dayOfWeek: DaysOfWeek.Monday,
        month: 'May',
        date: '2023-05-01',
        year: 2023,
        isWeekend: false,
        isToday: false,
      };
      expect(DateUtil.getDateValues(new Date(2023, 4, 1))).toEqual(expectedResult);
    });
  });

  describe('isToday', () => {
    it('should return true when the date is today', () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();

      expect(DateUtil.isToday(day, month, year)).toBeTrue();
    });

    it('should return false when the date is not today', () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate() + 1;

      expect(DateUtil.isToday(day, month, year)).toBeFalse();
    });
  });

  describe('dateStringToDate', () => {
    it('should return a date when given a valid date string', () => {
      expect(DateUtil.dateStringToDate('2023-05-01')).toEqual(new Date(2023, 4, 1));
    });
  });

  describe('dateTimeStringToDate', () => {
    it('should return a date when given a valid date time string', () => {
      expect(DateUtil.dateTimeStringToDate('2023-05-01T00:00:00')).toEqual(new Date(2023, 4, 1));
    });
  });

  describe('dateTimeStringToDateString', () => {
    it('should return a date string when given a valid date time string', () => {
      expect(DateUtil.dateTimeStringToDateString('2023-05-01T00:00:00')).toEqual('2023-05-01');
    });
  });

  describe('isInDateRangeInclusive', () => {
    it('should return true when the date is in the range', () => {
      const date = new Date(2023, 4, 1);
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 5, 1);
      expect(DateUtil.isInDateRangeInclusive(date, start, end)).toBeTrue();
    });

    it('should return true when the date is start/end date', () => {
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 5, 1);
      expect(DateUtil.isInDateRangeInclusive(start, start, end)).toBeTrue();
      expect(DateUtil.isInDateRangeInclusive(end, start, end)).toBeTrue();
    });

    it('should return false when the date is not in the range', () => {
      const dateBefore = new Date(2023, 2, 1);
      const dateAfter = new Date(2023, 5, 1);
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 4, 1);

      expect(DateUtil.isInDateRangeInclusive(dateBefore, start, end)).toBeFalse();
      expect(DateUtil.isInDateRangeInclusive(dateAfter, start, end)).toBeFalse();
    });
  });

  describe('areDatesInDateRangeInclusive', () => {
    it('should return true when the dates are in the range', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 2);
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 5, 1);
      const dates = [date1, date2, start, end];

      expect(DateUtil.areDatesInDateRangeInclusive(dates, start, end)).toBeTrue();
    });

    it('should return true when the dates are in the range or start/end', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 2);
      const dates = [date1, date2];
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 5, 1);

      expect(DateUtil.areDatesInDateRangeInclusive(dates, start, end)).toBeTrue();
    });

    it('should return false when any date is not in the range', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 10);
      const dates = [date1, date2];
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 4, 5);

      expect(DateUtil.areDatesInDateRangeInclusive(dates, start, end)).toBeFalse();
    });
  });

  describe('areAnyDatesInDateRangeInclusive', () => {
    it('should return true when any date is in the range', () => {
      const date1 = new Date(2023, 4, 1);
      const date2 = new Date(2023, 4, 10);
      const dates = [date1, date2];
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 4, 5);

      expect(DateUtil.areAnyDatesInDateRangeInclusive(dates, start, end)).toBeTrue();
    });

    it('should return false when no date is in the range', () => {
      const date1 = new Date(2023, 4, 5);
      const date2 = new Date(2023, 4, 10);
      const dates = [date1, date2];
      const start = new Date(2023, 3, 1);
      const end = new Date(2023, 4, 1);

      expect(DateUtil.areAnyDatesInDateRangeInclusive(dates, start, end)).toBeFalse();
    });
  });

  describe('isRangeInRangeInclusive', () => {
    it('should return true when range1 is in range2', () => {
      const start1 = new Date(2023, 4, 5);
      const end1 = new Date(2023, 4, 10);
      const start2 = new Date(2023, 4, 5);
      const end2 = new Date(2023, 4, 15);

      expect(
        DateUtil.isRangeInRangeInclusive({ start: start1, end: end1 }, { start: start2, end: end2 })
      ).toBeTrue();
    });

    it('should return true when there is intersection between ranges', () => {
      const start1 = new Date(2023, 0, 1);
      const end1 = new Date(2023, 1, 1);
      const start2 = new Date(2023, 0, 15);
      const end2 = new Date(2023, 1, 15);

      expect(
        DateUtil.isRangeInRangeInclusive({ start: start1, end: end1 }, { start: start2, end: end2 })
      ).toBeTrue();
      expect(
        DateUtil.isRangeInRangeInclusive({ start: start2, end: end2 }, { start: start1, end: end1 })
      ).toBeTrue();
    });

    it('should return true when there is no intersection between ranges', () => {
      const start1 = new Date(2023, 4, 1);
      const end1 = new Date(2023, 4, 10);
      const start2 = new Date(2023, 4, 11);
      const end2 = new Date(2023, 4, 15);

      expect(
        DateUtil.isRangeInRangeInclusive({ start: start1, end: end1 }, { start: start2, end: end2 })
      ).toBeFalse();
    });
  });

  describe('isDateInDates', () => {
    it('should return true when date is in dates', () => {
      const date = new Date(2023, 4, 1);
      const dates = [new Date(2023, 4, 1), new Date(2023, 4, 2)];

      expect(DateUtil.isDateInDates(date, dates)).toBeTrue();
    });

    it('should return false when date is not in dates', () => {
      const date = new Date(2023, 4, 1);
      const dates = [new Date(2023, 4, 2), new Date(2023, 4, 3)];

      expect(DateUtil.isDateInDates(date, dates)).toBeFalse();
    });
  });
});
