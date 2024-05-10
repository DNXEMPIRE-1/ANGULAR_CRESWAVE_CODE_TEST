import { FormValue } from './../../../../models/types/form-types';
import { FormControl } from '@angular/forms';

export interface DateRangeForm {
  start: FormControl<Date | null>;
  end: FormControl<Date | null>;
}

export type DateRangeValue = FormValue<DateRangeForm>;
