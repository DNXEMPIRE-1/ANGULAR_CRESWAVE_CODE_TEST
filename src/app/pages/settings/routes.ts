import { Pages } from 'src/app/util';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: Pages.MyProfile,
    component: MyProfileComponent,
  },
];
