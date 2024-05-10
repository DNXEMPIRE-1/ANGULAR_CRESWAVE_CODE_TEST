import { FormControl } from '@angular/forms';

export interface TypedForm {
  [key: string]: FormControl<unknown>;
}
