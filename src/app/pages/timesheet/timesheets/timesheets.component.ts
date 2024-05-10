import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { STORE_SERVICE } from 'src/app/services/interfaces';
import { DateUtil, FormUtil, PubSubUtil, StoreKeys, paths } from 'src/app/util';
import { TitleComponent } from '../../../shared/components/title/title.component';

import { AppService } from 'src/app/services';
import { DateRangePickerComponent } from 'src/app/shared/components/inputs/date-range-picker';
import { DateRangeForm } from 'src/app/shared/components/inputs/date-range-picker/date-range-form-group';
import { SlideComponent } from 'src/app/shared/components/inputs/slide/slide.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { ProfileService } from '../../profile/services/profile.service';
import { TimesheetCarouselComponent } from '../components/timesheet-carousel/timesheet-carousel.component';
import { TimesheetListComponent } from '../components/timesheet-list/timesheet-list.component';
import { TimesheetService } from '../services/timesheet.service';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageLayoutComponent,
    TitleComponent,
    FormLayoutComponent,
    ReactiveFormsModule,
    SlideComponent,
    DateRangePickerComponent,
    NgIf,
    NgClass,
    TimesheetCarouselComponent,
    TimesheetListComponent,
    RouterOutlet,
  ],
})
export class TimesheetsComponent implements OnInit, OnDestroy {
  private service = inject(TimesheetService);
  private app = inject(AppService);
  private store = inject(STORE_SERVICE);
  private profileService = inject(ProfileService);

  private destroyed$ = new Subject<boolean>();

  paths = paths;

  filterForm!: FormGroup<{
    range: FormGroup<DateRangeForm>;
    showList: FormControl<boolean>;
    showCalendar: FormControl<boolean>;
  }>;

  today = new Date();
  twoMonthsAgo = DateUtil.addMonths(this.today, -2);
  twoMonthsFromNow = DateUtil.addMonths(this.today, 2);

  get range() {
    return this.filterForm.controls.range;
  }

  get showList() {
    return this.filterForm.controls.showList;
  }

  get showCalendar() {
    return this.filterForm.controls.showCalendar;
  }

  enableListAnimation = true;
  enableCalendarAnimation = true;

  ngOnInit(): void {
    this.initFilterForm();
    this.profileService.loadUserProfiles();
    this.service.loadListData();
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private initSubs(): void {
    PubSubUtil.createAppDateRangeSub(this.range, this.app, this.destroyed$);
  }

  initFilterForm(): void {
    const { start, end } = this.app.getDateRangeOrDefault();

    const { timesheetShowCalendar, timesheetShowList } = this.store.getMany<boolean>([
      { key: StoreKeys.TimesheetShowList, type: 'boolean' },
      { key: StoreKeys.TimesheetShowCalendar, type: 'boolean' },
    ]);

    this.enableListAnimation = timesheetShowList ?? true;
    this.enableCalendarAnimation = timesheetShowCalendar ?? true;

    this.filterForm = new FormGroup({
      range: FormUtil.buildDateRangeGroup(start, end),
      showList: new FormControl(this.enableListAnimation, { nonNullable: true }),
      showCalendar: new FormControl(this.enableCalendarAnimation, { nonNullable: true }),
    });
  }

  onSelectDate(date: Date): void {
    this.service.goToCreateOrDetailsBasedOnDate(date);
  }

  onShowListChanged(value: boolean): void {
    this.enableListAnimation = true;
    this.store.store({
      key: StoreKeys.TimesheetShowList,
      value,
    });
  }

  onShowCalendarChanged(value: boolean): void {
    this.enableCalendarAnimation = true;
    this.store.store({
      key: StoreKeys.TimesheetShowCalendar,
      value,
    });
  }
}
