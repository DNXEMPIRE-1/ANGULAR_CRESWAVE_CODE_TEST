import {
  DatePipe,
  FormStyle,
  TranslationWidth,
  WeekDay,
  getLocaleMonthNames,
} from '@angular/common';
import { Injectable } from '@angular/core';
import { DateValues, DaysOfWeek, Nullish } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class DateUtil {
  static formatDateToUniversalFormat = (date: Date): string => {
    if (!date) return '';

    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(date, 'yyyy-MM-dd');

    return formattedDate || '';
  };

  static dateStringToDate = (dateString: string): Date => {
    const [year, monthIndex, day] = dateString.split('-').map((x) => +x);

    return new Date(year, monthIndex - 1, day);
  };

  static dateTimeStringToDate = (dateTimeString: string): Date => {
    const date = DateUtil.dateTimeStringToDateString(dateTimeString);
    return DateUtil.dateStringToDate(date);
  };

  static dateTimeStringToDateString = (dateTimeString: string | Nullish): string => {
    if (!dateTimeString) return '';

    const [date] = dateTimeString.split('T');
    return date;
  };

  static formatDateTimeToUniversalFormat = (date: Date): string => {
    if (!date) return '';

    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss');

    return formattedDate || '';
  };

  static formatDay = (date: Date): string => {
    if (!date) return '';

    return DateUtil.formatDayFromNumber(date.getDate());
  };

  private static formatDayFromNumber = (day: number): string => {
    if (!day) return '';

    return day.toString().padStart(2, '0');
  };

  static isInDateRangeInclusive = (date: Date, start: Date, end: Date): boolean => {
    if (!date || !start || !end) return false;

    return date >= start && date <= end;
  };

  static areDatesInDateRangeInclusive = (dates: Date[], start: Date, end: Date): boolean => {
    if (!dates.length || !start || !end) return false;

    return dates.every((date) => DateUtil.isInDateRangeInclusive(date, start, end));
  };

  static areAnyDatesInDateRangeInclusive = (dates: Date[], start: Date, end: Date): boolean => {
    if (!dates.length || !start || !end) return false;

    return dates.some((date) => DateUtil.isInDateRangeInclusive(date, start, end));
  };

  static isRangeInRangeInclusive = (
    range1: { start: Date; end: Date },
    range2: { start: Date; end: Date }
  ): boolean => {
    if (!range1 || !range2) return false;

    const { start: start1, end: end1 } = range1;
    const { start: start2, end: end2 } = range2;
    if (!start1 || !end1 || !start2 || !end2) return false;

    return (
      DateUtil.areAnyDatesInDateRangeInclusive([start1, end1], start2, end2) ||
      DateUtil.areAnyDatesInDateRangeInclusive([start2, end2], start1, end1)
    );
  };

  static datesEqual = (date1: Date, date2: Date): boolean => {
    if (!date1 || !date2) return false;

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  static isDateInDates = (date: Date, dates: Date[]): boolean => {
    if (!date || !dates.length) return false;

    return dates.some((d) => DateUtil.datesEqual(date, d));
  };

  static toDayOfWeek = (dayOfWeek: WeekDay): DaysOfWeek | '' => {
    const weekDays: { [key: number]: DaysOfWeek } = {
      [WeekDay.Sunday]: DaysOfWeek.Sunday,
      [WeekDay.Monday]: DaysOfWeek.Monday,
      [WeekDay.Tuesday]: DaysOfWeek.Tuesday,
      [WeekDay.Wednesday]: DaysOfWeek.Wednesday,
      [WeekDay.Thursday]: DaysOfWeek.Thursday,
      [WeekDay.Friday]: DaysOfWeek.Friday,
      [WeekDay.Saturday]: DaysOfWeek.Saturday,
    };

    return weekDays[dayOfWeek] ?? '';
  };

  static addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  static addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  static addWeeks = (date: Date, weeks: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result;
  };

  static daysDiff = (startDate: Date, endDate: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
  };

  static getMonthName = (month: number): string => {
    const monthNames = getLocaleMonthNames('en-US', FormStyle.Format, TranslationWidth.Wide);

    return monthNames[month - 1];
  };

  static isWeekend = (dayOfWeek: WeekDay): boolean => {
    return dayOfWeek === WeekDay.Saturday || dayOfWeek === WeekDay.Sunday;
  };

  static isToday = (date: number, month: number, year: number): boolean => {
    const today = new Date();
    return date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  static getDateValues(date: Date): DateValues {
    const dayIndex = date.getDay();

    const dateNumber = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const formattedDate = DateUtil.formatDateToUniversalFormat(date);
    const day = DateUtil.formatDayFromNumber(dateNumber);
    const dayOfWeek = DateUtil.toDayOfWeek(dayIndex);
    const isWeekend = DateUtil.isWeekend(dayIndex);
    const month = DateUtil.getMonthName(monthIndex + 1);

    return {
      date: formattedDate,
      dayOfWeek,
      day,
      month,
      year,
      isWeekend,
      isToday: DateUtil.isToday(dateNumber, monthIndex, year),
    };
  }
}
