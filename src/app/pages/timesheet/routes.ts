import { Routes } from '@angular/router';
import { canDeactivateForm } from 'src/app/guards/form.guard';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';
import { PageStates } from 'src/app/util';
import { CreateTimesheetComponent } from './create-timesheet/create-timesheet.component';
import { TimesheetsComponent } from './timesheets/timesheets.component';

export const TIMESHEET_ROUTES: Routes = [
  {
    path: '',
    component: TimesheetsComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreateTimesheetComponent,
        canDeactivate: [canDeactivateForm],
      },
      {
        path: PageStates.Details,
        component: TimesheetDetailsComponent,
        canDeactivate: [canDeactivateForm],
      },
    ],
  },
];
