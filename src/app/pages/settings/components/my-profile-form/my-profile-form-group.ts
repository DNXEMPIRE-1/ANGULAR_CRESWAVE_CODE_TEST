import { FormControl, FormGroup } from '@angular/forms';
import { FormValue } from 'src/app/models';
import {
  nameValidators,
  userNameValidators,
} from 'src/app/pages/authentication/components/signup-form/signup-form-group';

export class MyProfileFormGroup extends FormGroup<MyProfileForm> {
  static from(form: MyProfileForm): MyProfileFormGroup {
    return new MyProfileFormGroup(form);
  }

  static getFormKeys(): (keyof MyProfileForm)[] {
    return ['name', 'userName'];
  }

  static toJson = (fg: MyProfileFormGroup) => {
    return fg.getRawValue();
  };
}

export const getMyProfileForm = () => {
  return {
    name: new FormControl('', {
      nonNullable: true,
      validators: nameValidators,
    }),
    userName: new FormControl('', {
      nonNullable: true,
      validators: userNameValidators,
    }),
  };
};

export type MyProfileForm = ReturnType<typeof getMyProfileForm>;
export type MyProfileFormValue = FormValue<MyProfileForm>;
