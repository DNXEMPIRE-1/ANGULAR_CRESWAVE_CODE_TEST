import { FormControl, FormGroup } from '@angular/forms';
import { FormValue } from 'src/app/models';
import {
  SignupFormGroup,
  getSignupForm,
} from 'src/app/pages/authentication/components/signup-form';
import { passwordValidators } from 'src/app/pages/authentication/components/signup-form/signup-form-group';

export class UserFormGroup extends FormGroup<UserForm> {
  static from(form: UserForm): UserFormGroup {
    return new UserFormGroup(form);
  }

  static getFormKeys(): (keyof UserForm)[] {
    return [...SignupFormGroup.getFormKeys()];
  }

  static toJson = (fg: UserFormGroup) => {
    return fg.getRawValue();
  };
}

export class UserCreateFormGroup extends FormGroup<UserCreateForm> {
  static from(form: UserCreateForm): UserCreateFormGroup {
    return new UserCreateFormGroup(form);
  }

  static getFormKeys(): (keyof UserCreateForm)[] {
    return [...SignupFormGroup.getFormKeys()];
  }

  static toJson = (fg: UserCreateFormGroup) => {
    return fg.getRawValue();
  };
}

export const getUserForm = () => {
  const optionalPasswordSignup = {
    ...getSignupForm(),
    confirmPassword: new FormControl('', {
      validators: passwordValidators,
    }),
    password: new FormControl('', {
      validators: passwordValidators,
    }),
  };

  return {
    ...optionalPasswordSignup,
    roleIds: new FormControl<number[]>([]),
  };
};

export const getUserCreateForm = () => {
  return {
    ...getSignupForm(),
    roleIds: new FormControl<number[]>([]),
  };
};

export type UserForm = ReturnType<typeof getUserForm>;
export type UserFormValue = FormValue<UserForm>;

export type UserCreateForm = ReturnType<typeof getUserCreateForm>;
export type UserCreateFormValue = FormValue<UserCreateForm>;
