import { Routes } from '@angular/router';
import { canDeactivateForm } from 'src/app/guards/form.guard';
import { PageStates } from 'src/app/util';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersComponent } from './users/users.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreateUserComponent,
        canDeactivate: [canDeactivateForm],
      },
      {
        path: PageStates.Details,
        component: UserDetailsComponent,
        canDeactivate: [canDeactivateForm],
      },
    ],
  },
];
