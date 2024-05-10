import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringUtil {
  static capitalize = (word: string | undefined): string => {
    if (!word) return '';

    return word[0].toUpperCase() + word.substring(1);
  };

  static timeToNumber = (timeHhMm: string | undefined): number => {
    if (typeof timeHhMm !== 'string') return timeHhMm ?? 0;

    const splitTime = timeHhMm?.split(':');
    if (splitTime?.length !== 2) return 0;

    const [hours, minutes] = splitTime;
    return Number(hours + minutes);
  };

  static numberToTime(numberTimeArg: number | null | undefined): string {
    if (!StringUtil.isNumberValid(numberTimeArg)) return '';

    const numberTime = StringUtil.normalizeIfMinutesAbove60(numberTimeArg as number);
    let time = StringUtil.separateTime(numberTime.toString());

    while (time.length < 5) {
      if (!time.includes(':')) time = `:${'0'.repeat(2 - time.length)}${time}`;

      time = `0${time}`;
    }

    return time;
  }

  private static isNumberValid = (number: number | null | undefined): boolean => {
    return number != null && number >= 0 && number <= 9999;
  };

  private static separateTime = (time: string): string => {
    if (time.length <= 2) return time;

    return time.slice(0, -2) + ':' + time.slice(-2);
  };

  private static normalizeIfMinutesAbove60 = (numberTime: number): number => {
    const minutesInHours = 60;
    const timeHour = 100;
    const lastTwoDigits = numberTime % timeHour;
    if (lastTwoDigits < minutesInHours) return numberTime;

    return numberTime + timeHour - minutesInHours;
  };

  static isEmail = (email: string): boolean => {
    return RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);
  };

  static notEmpty(items: unknown[] | string | undefined | null): boolean {
    return items != null && items?.length > 0;
  }

  static unsafeRandomHex(length = 10): string {
    const hex = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += hex[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  static stringsEqual(str1: string, str2: string): boolean {
    return str1.toLowerCase() === str2.toLowerCase();
  }

  static replaceAll(str: string, search: string, replacement: string): string {
    return str.replace(new RegExp(search, 'g'), replacement);
  }
}
