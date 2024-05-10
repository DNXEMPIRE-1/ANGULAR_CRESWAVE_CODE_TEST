import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/models';

export class LoginFormGroup extends FormGroup<LoginForm> {
  static from(form: LoginForm): LoginFormGroup {
    return new LoginFormGroup(form);
  }

  static getFormKeys(): (keyof LoginForm)[] {
    return ['userNameOrEmail', 'password'];
  }

  static toEntityWithUserName(controls: LoginForm): Login {
    return { password: controls.password.value, userName: controls.userNameOrEmail.value };
  }

  static toEntityWithEmail(controls: LoginForm): Login {
    return { password: controls.password.value, email: controls.userNameOrEmail.value };
  }
}

export interface LoginForm {
  userNameOrEmail: FormControl<string>;
  password: FormControl<string>;
}

export const getLoginForm = (): LoginForm => ({
  userNameOrEmail: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100)],
  }),
  password: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  }),
});
