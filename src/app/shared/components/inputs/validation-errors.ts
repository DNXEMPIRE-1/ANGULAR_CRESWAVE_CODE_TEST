export enum ValidationErrorKeys {
  Required = 'required',
  MaxLength = 'maxlength',
  MinLength = 'minlength',
  NonNullable = 'nonnullable',
  Pattern = 'pattern',
  Email = 'email',
  PasswordStrength = 'passwordstrength',
  ConfirmPassword = 'confirmpassword',
  Username = 'username',
}

export const validationErrorMessages: { [key in ValidationErrorKeys]: string } = {
  [ValidationErrorKeys.Required]: 'This field is required',
  [ValidationErrorKeys.MaxLength]: 'This field has too many characters',
  [ValidationErrorKeys.MinLength]: 'This field has too few characters',
  [ValidationErrorKeys.NonNullable]: 'This field is required',
  [ValidationErrorKeys.Pattern]: 'This field is invalid',
  [ValidationErrorKeys.Email]: 'This field must be a valid email',
  [ValidationErrorKeys.PasswordStrength]:
    'This field must contain at least one uppercase letter, one lowercase letter, and one number',
  [ValidationErrorKeys.ConfirmPassword]: 'Passwords must match',
  [ValidationErrorKeys.Username]:
    'Only letters, numbers or "_" or "." special characters are allowed',
};
