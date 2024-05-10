import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services';
import { SignupFormComponent } from '../components';
import { SignupFormGroup, getSignupForm } from '../components/signup-form';
import { AuthPageLayoutComponent } from 'src/app/shared/components/layouts/auth-page-layout/auth-page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [AuthPageLayoutComponent, TitleComponent, SignupFormComponent],
})
export class SignupComponent implements OnInit {
  private service = inject(AuthService);
  private toaster = inject(ToastService);

  form!: SignupFormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = SignupFormGroup.from(getSignupForm());
  }

  async signup(form: SignupFormGroup): Promise<void> {
    const signup = SignupFormGroup.toJson(form);

    await this.service.signup(signup);

    this.toaster.success('Sign up successful!');
  }
}
