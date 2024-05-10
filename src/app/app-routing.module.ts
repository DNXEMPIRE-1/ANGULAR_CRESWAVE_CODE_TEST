import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pages, paths } from './util';
import { HomeComponent } from './pages/home/home.component';
import { canActivateAuth, canActivateAuthPage, canActivateAuthAdmin } from './guards/auth.guard';
import { RootPageComponent } from './pages/root-page/root-page.component';

const routes: Routes = [
  {
    path: '',
    component: RootPageComponent,
    children: [
      {
        path: '',
        redirectTo: Pages.Home,
        pathMatch: 'full',
      },
      {
        path: Pages.Home,
        component: HomeComponent,
        canActivate: [() => canActivateAuth()],
      },
      {
        path: Pages.Timesheets,
        loadChildren: () => import('./pages/timesheet/routes').then((m) => m.TIMESHEET_ROUTES),
        canActivate: [() => canActivateAuth()],
      },
      {
        path: Pages.Profiles,
        loadChildren: () => import('./pages/profile/routes').then((m) => m.PROFILE_ROUTES),
        canActivate: [() => canActivateAuth()],
      },
      {
        path: Pages.PresetTaskItems,
        loadChildren: () => import('./pages/profile/routes').then((m) => m.PRESET_TASK_ITEM_ROUTES),
        canActivate: [() => canActivateAuth()],
      },
      {
        path: Pages.Users,
        loadChildren: () => import('./pages/user/routes').then((m) => m.USER_ROUTES),
        canActivate: [() => canActivateAuthAdmin()],
      },
      {
        path: Pages.Settings,
        loadChildren: () => import('./pages/settings/routes').then((m) => m.SETTINGS_ROUTES),
        canActivate: [() => canActivateAuth()],
      },
      {
        path: Pages.Metrics,
        loadChildren: () => import('./pages/metrics/routes').then((m) => m.METRICS_ROUTES),
        canActivate: [() => canActivateAuth()],
      },
      {
        path: Pages.Faqs,
        loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent),
        canActivate: [() => canActivateAuth()],
      },
      {
        path: Pages.NotFound,
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
  {
    path: Pages.Auth,
    redirectTo: `${Pages.Auth}/${Pages.Login}`,
    pathMatch: 'full',
  },
  {
    path: Pages.Auth,
    loadChildren: () => import('./pages/authentication/routes').then((m) => m.AUTH_ROUTES),
    canActivateChild: [() => canActivateAuthPage()],
  },
  {
    path: '**',
    redirectTo: paths.notFound,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
