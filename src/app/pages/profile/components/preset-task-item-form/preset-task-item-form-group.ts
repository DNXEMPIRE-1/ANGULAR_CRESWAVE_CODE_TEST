import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValue, PresetTaskItem } from 'src/app/models';
import { StringUtil } from 'src/app/util';

export class PresetTaskItemFormGroup extends FormGroup<PresetTaskItemForm> {
  static from(form: PresetTaskItemForm): PresetTaskItemFormGroup {
    return new PresetTaskItemFormGroup(form);
  }

  static getFormKeys(): (keyof PresetTaskItemForm)[] {
    return ['title', 'comment', 'time'];
  }

  static toJson = (fg: PresetTaskItemFormGroup): Partial<PresetTaskItem> => {
    const value = fg.getRawValue();

    return {
      ...value,
      time: StringUtil.timeToNumber(value.time ?? ''),
    } as Partial<PresetTaskItem>;
  };
}

export interface PresetTaskItemForm {
  id: FormControl<number | null>;
  title: FormControl<string>;
  comment: FormControl<string | null>;
  time: FormControl<string | null>;
}

export type PresetTaskItemFormValue = FormValue<PresetTaskItemForm>;

export const getPresetTaskItemFormGroup = (): FormGroup<PresetTaskItemForm> => {
  return new FormGroup(getPresetTaskItemForm());
};

export const getPresetTaskItemForm = () => {
  return {
    id: new FormControl(0),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    comment: new FormControl(''),
    time: new FormControl('00:00'),
  };
};
