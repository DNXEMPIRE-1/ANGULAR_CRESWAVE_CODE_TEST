import { Routes } from '@angular/router';
import { canDeactivateForm } from 'src/app/guards/form.guard';
import { PageStates } from 'src/app/util';
import { CreatePresetTaskItemComponent } from './create-preset-task-item/create-preset-task-item.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { PresetTaskItemDetailsComponent } from './preset-task-item-details/preset-task-item-details.component';
import { PresetTaskItemsComponent } from './preset-task-items/preset-task-items.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfilesComponent } from './profiles/profiles.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreateProfileComponent,
        canDeactivate: [canDeactivateForm],
      },
      {
        path: PageStates.Details,
        component: ProfileDetailsComponent,
        canDeactivate: [canDeactivateForm],
      },
    ],
  },
];

export const PRESET_TASK_ITEM_ROUTES: Routes = [
  {
    path: '',
    component: PresetTaskItemsComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreatePresetTaskItemComponent,
        canDeactivate: [canDeactivateForm],
      },
      {
        path: PageStates.Details,
        component: PresetTaskItemDetailsComponent,
        canDeactivate: [canDeactivateForm],
      },
    ],
  },
];
