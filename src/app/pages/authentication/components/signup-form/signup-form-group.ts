import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { passwordsAreEqual, userNameValidator } from 'src/app/helpers';
import { Signup } from 'src/app/models';

export class SignupFormGroup extends FormGroup<SignupForm> {
  static from(form: SignupForm): SignupFormGroup {
    return new SignupFormGroup(form, { validators: passwordsAreEqual() });
  }

  static getFormKeys(): (keyof SignupForm)[] {
    return ['userName', 'email', 'name', 'password'];
  }

  static toJson(fg: SignupFormGroup): Signup {
    return fg.getRawValue();
  }
}

export interface SignupForm {
  userName: FormControl<string>;
  email: FormControl<string>;
  name: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export const passwordValidators: ValidatorFn[] = [
  Validators.minLength(10),
  passwordStrengthValidator(),
];

export const nameValidators: ValidatorFn[] = [Validators.required, Validators.maxLength(100)];
export const userNameValidators: ValidatorFn[] = [
  Validators.required,
  Validators.maxLength(100),
  userNameValidator(),
];

export const getSignupForm = (): SignupForm => ({
  userName: new FormControl('', {
    nonNullable: true,
    validators: userNameValidators,
  }),
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email, Validators.maxLength(100)],
  }),
  name: new FormControl('', {
    nonNullable: true,
    validators: nameValidators,
  }),
  password: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, ...passwordValidators],
  }),
  confirmPassword: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, ...passwordValidators],
  }),
});

function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      return { passwordstrength: true };
    }
    return null;
  };
}
