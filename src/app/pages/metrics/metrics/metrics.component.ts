import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppService } from 'src/app/services';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { DateRangePickerComponent } from 'src/app/shared/components/inputs/date-range-picker';
import { DateRangeForm } from 'src/app/shared/components/inputs/date-range-picker/date-range-form-group';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { DateUtil, FormUtil, Icons, PubSubUtil } from 'src/app/util';
import { ProfileService } from '../../profile/services/profile.service';
import { TimesheetService } from '../../timesheet/services/timesheet.service';
import { MetricsStatsComponent } from '../components/metrics-stats/metrics-stats.component';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateRangePickerComponent,
    FormLayoutComponent,
    IconComponent,
    PageLayoutComponent,
    TitleComponent,
    MetricsStatsComponent,
  ],
})
export class MetricsComponent implements OnInit, OnDestroy {
  private app = inject(AppService);
  private timesheetService = inject(TimesheetService);
  private profileService = inject(ProfileService);

  avgMetrics$ = this.timesheetService.avgMetrics$;
  destroyed$ = new Subject<boolean>();

  filterForm!: FormGroup<{
    range: FormGroup<DateRangeForm>;
  }>;

  Icons = Icons;

  today = new Date();
  twoMonthsAgo = DateUtil.addMonths(this.today, -2);
  twoMonthsFromNow = DateUtil.addMonths(this.today, 2);

  get range() {
    return this.filterForm.controls.range;
  }

  ngOnInit(): void {
    this.profileService.loadUserProfiles();
    this.timesheetService.loadListData();
    this.initFilterForm();
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  initFilterForm(): void {
    const { start, end } = this.app.getDateRangeOrDefault();

    this.filterForm = new FormGroup({
      range: FormUtil.buildDateRangeGroup(start, end),
    });
  }

  private initSubs(): void {
    PubSubUtil.createAppDateRangeSub(this.range, this.app, this.destroyed$);
  }
}
