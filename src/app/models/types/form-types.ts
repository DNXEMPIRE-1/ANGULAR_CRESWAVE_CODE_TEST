import { FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export type FormItemValue = string | number | boolean | null | undefined;

export type FormItem = { [key: string]: [FormItemValue, ValidatorFn[]] | FormItemValue };

export type FormValue<TForm> = {
  [TKey in keyof TForm]: TForm[TKey] extends FormControl<infer TValue>
    ? TValue
    : TForm[TKey] extends FormGroup<infer TNestedForm>
    ? FormValue<TNestedForm>
    : TForm[TKey] extends FormArray<infer TArrayForm>
    ? TArrayForm extends FormGroup<infer TArrayFormGroup>
      ? Partial<FormValue<TArrayFormGroup>>[]
      : Partial<FormValue<TArrayForm>>[]
    : never;
};
