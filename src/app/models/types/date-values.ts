import { DaysOfWeek } from './days-of-week.enum';

export interface DateValues {
  date: string;
  day: string;
  month: string;
  year: number;
  dayOfWeek: DaysOfWeek | '';
  isWeekend: boolean;
  isHoliday?: boolean;
  isSpecial?: boolean;
  isToday?: boolean;
}

export interface ProfileDateValues {
  formattedDate: string;
  isWeekend: boolean;
  isHoliday: boolean;
}
