import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserUtil } from 'src/app/pages/user/services/user.util';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { InputComponent } from 'src/app/shared/components/inputs/input/input.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { ElementIds, FormUtil } from 'src/app/util';
import { SignupFormGroup } from './signup-form-group';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormLayoutComponent, InputComponent, ButtonComponent],
})
export class SignupFormComponent {
  @Input() form!: SignupFormGroup;

  @Output() save = new EventEmitter<SignupFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  passwordVisible = false;
  visibilityIcon = UserUtil.getVisibilityIcon(() => this.togglePasswordVisibility());
  passwordHelpers = UserUtil.getPasswordHelpers();

  onSubmit(): void {
    FormUtil.onSubmit(this.form, this.save);
  }

  togglePasswordVisibility = (): void => {
    this.passwordVisible = !this.passwordVisible;
    this.visibilityIcon.color = this.passwordVisible ? 'primary' : 'accent';
  };
}
