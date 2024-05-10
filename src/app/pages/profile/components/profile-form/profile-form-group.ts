import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValue, Profile } from 'src/app/models';
import { TimePipe } from 'src/app/pipes/time.pipe';

export class ProfileFormGroup extends FormGroup<ProfileForm> {
  static from(form: ProfileForm): ProfileFormGroup {
    return new ProfileFormGroup(form);
  }

  static getFormKeys(): (keyof Profile & keyof ProfileForm)[] {
    return ['name', 'timeTarget', 'tasksTarget', 'priority', 'profileTypeId'];
  }

  static toJson = (fg: ProfileFormGroup): Partial<Profile> => {
    const value = fg.getRawValue();
    return {
      ...value,
      timeTarget: TimePipe.formatTimeHhMm(value.timeTarget),
      profilePresetTaskItems: value.taskIds?.map((id) => ({ presetTaskItemId: id })),
    } as Partial<Profile>;
  };
}

export interface ProfileForm {
  name: FormControl<string>;
  timeTarget: FormControl<string>;
  tasksTarget: FormControl<number | undefined>;
  priority: FormControl<number | undefined>;
  profileTypeId: FormControl<number | undefined>;
  taskIds: FormControl<number[] | null>;
}

export type ProfileFormValue = FormValue<ProfileForm>;

export const getProfileForm = (): ProfileForm => ({
  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(250)],
  }),
  timeTarget: new FormControl('00:00', { nonNullable: true, validators: [Validators.required] }),
  tasksTarget: new FormControl<number | undefined>(undefined, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  }),
  priority: new FormControl(),
  profileTypeId: new FormControl<number | undefined>(undefined, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  }),
  taskIds: new FormControl<number[]>([]),
});
