import { Pages } from 'src/app/util';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: Pages.Login,
    component: LoginComponent,
  },
  {
    path: Pages.Signup,
    component: SignupComponent,
  },
];
