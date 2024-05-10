import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services';
import { StringUtil } from 'src/app/util';
import { LoginFormComponent } from '../components';
import { LoginFormGroup, getLoginForm } from '../components/login-form';
import { AuthPageLayoutComponent } from 'src/app/shared/components/layouts/auth-page-layout/auth-page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [AuthPageLayoutComponent, TitleComponent, LoginFormComponent],
})
export class LoginComponent implements OnInit {
  private service = inject(AuthService);
  private toaster = inject(ToastService);

  form!: LoginFormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = LoginFormGroup.from(getLoginForm());
  }

  async login(form: LoginFormGroup): Promise<void> {
    const login = StringUtil.isEmail(form.controls.userNameOrEmail.value)
      ? LoginFormGroup.toEntityWithEmail(form.controls)
      : LoginFormGroup.toEntityWithUserName(form.controls);

    await this.service.login(login);

    this.toaster.success('Login successful!');
  }
}
