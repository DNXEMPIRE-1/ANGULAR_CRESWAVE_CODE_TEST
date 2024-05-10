import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services';
import { paths } from '../util';
import { ToastService } from '../services/toast.service';

export const canActivateAuth = (service = inject(AuthService)): true | UrlTree => {
  const router = inject(Router);
  const toaster = inject(ToastService);
  if (service.isLoggedIn) return true;

  toaster.info('Login to access other pages');

  return router.parseUrl(paths.login);
};

export const canActivateAuthAdmin = (service = inject(AuthService)): true | UrlTree => {
  const toaster = inject(ToastService);
  const router = inject(Router);
  if (service.isAdmin) return true;

  toaster.warning('You do not have permission to access this page');

  return router.parseUrl(paths.home);
};

export const canActivateAuthPage = (service = inject(AuthService)): true | UrlTree => {
  const router = inject(Router);
  const toaster = inject(ToastService);

  if (!service.isLoggedIn) return true;

  toaster.info('You are already logged in! Logout if you want to enter with another account.');

  return router.parseUrl(paths.home);
};
