import { AbstractControl, FormGroup } from '@angular/forms';

export interface CanDeactivateForm<T extends { [K in keyof T]: AbstractControl }> {
  form: FormGroup<T>;
}
