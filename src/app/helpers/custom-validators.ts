import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordsAreEqual(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const confirmPasswordControl = control.get('confirmPassword');
    if (confirmPasswordControl == null) return null;

    const password = control.get('password')?.value;
    const confirmPassword = confirmPasswordControl?.value;
    const errorKey = 'confirmpassword';

    if (password !== confirmPassword && confirmPasswordControl != null) {
      const error = { [errorKey]: true };

      confirmPasswordControl.setErrors(error);
      return error;
    }

    if (confirmPasswordControl?.hasError(errorKey)) {
      confirmPasswordControl.setErrors(null);
    }
    return null;
  };
}

export function userNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value && !/^[a-zA-Z0-9_.]+$/.test(value)) {
      return { username: true };
    }
    return null;
  };
}

export function dateMaxValidator(dateMax: Date): ValidatorFn {
  return (
    control: AbstractControl<Date>
  ): { [key: string]: { datemax: Date; actual: Date } } | null => {
    const value = control.value;

    if (value && value.getTime() > dateMax.getTime()) {
      return {
        datemax: {
          datemax: dateMax,
          actual: value,
        },
      };
    }
    return null;
  };
}
