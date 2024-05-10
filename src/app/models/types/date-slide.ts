import { DateValues } from './date-values';

export interface DateSlide extends DateValues {
  id: string;
  key: string;
  selected?: boolean;
  firstOfMonth?: boolean;
}
