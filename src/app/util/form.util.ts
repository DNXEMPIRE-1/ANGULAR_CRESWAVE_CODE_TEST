import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormTypes, StringUtil } from '../util';
import { FormValue } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FormUtil {
  static onSubmit<T extends FormGroup>(form: T, save: EventEmitter<T>): void {
    if (!form.valid) return form.markAllAsTouched();
    save.emit(form);
    form.markAsPristine();
  }

  static isCreateForm = (type: FormTypes) => type === FormTypes.Create;
  static isViewForm = (type: FormTypes) => type === FormTypes.View;
  static isEditForm = (type: FormTypes) => type === FormTypes.Edit;
  static isDuplicateForm = (type: FormTypes) => type === FormTypes.Duplicate;

  static getSubmitLabel = (type: FormTypes): string => {
    const submitLabels: { [key: string]: string } = {
      [FormTypes.Create]: 'Create',
      [FormTypes.Edit]: 'Update',
      [FormTypes.Duplicate]: 'Duplicate',
    };

    return submitLabels[type] || '';
  };

  static setFormFromItem<T extends object>(fg: FormGroup, item: T): void {
    fg.patchValue(item);
  }

  static buildFormArray<T extends object>(items: T[], getFg: () => FormGroup): FormArray {
    return new FormArray(
      items.map((item) => {
        const fg = getFg();
        this.setFormFromItem(fg, item);
        return fg;
      })
    );
  }

  static addItemsToFormArray<TForm extends { [K in keyof TForm]: AbstractControl }>(
    items: Partial<FormValue<TForm>>[],
    formArray: FormArray<FormGroup<TForm>>,
    getFg: () => FormGroup<TForm>
  ): void {
    formArray.clear();

    items.forEach((item) => {
      const fg = getFg();
      fg.patchValue(item as never);
      formArray.push(fg);
    });
  }

  static buildDateRangeGroup(start: Date | null = null, end: Date | null = null) {
    return new FormGroup({
      start: new FormControl<Date | null>(start),
      end: new FormControl<Date | null>(end),
    });
  }

  static buildId(controlName: string, formId = ''): string {
    if (!controlName) return '';

    if (!formId) return controlName;

    return [formId, StringUtil.capitalize(controlName)].join('');
  }

  static updateStatusOnFormChange(
    form: FormGroup,
    destroyed$: Subject<boolean>,
    changeEnabledFn: () => void
  ) {
    return form?.statusChanges
      .pipe(takeUntil(destroyed$), distinctUntilChanged())
      .subscribe((st) => {
        if (st !== 'DISABLED') changeEnabledFn();
      });
  }
}
