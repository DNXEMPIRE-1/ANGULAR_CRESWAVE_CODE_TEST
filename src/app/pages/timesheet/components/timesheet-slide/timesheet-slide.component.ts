import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, map } from 'rxjs';
import { DateSlide, Profile, TimesheetMetrics } from 'src/app/models';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { TimePipe } from 'src/app/pipes';
import { ButtonComponent, IconButtonComponent } from 'src/app/shared/components/buttons';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { DetailsTypes, Icons, StringUtil } from 'src/app/util';
import { TimesheetService } from '../../services/timesheet.service';
import { TimesheetSlideSpanComponent } from '../timesheet-slide-span/timesheet-slide-span.component';

@Component({
  selector: 'app-timesheet-slide',
  templateUrl: './timesheet-slide.component.html',
  styleUrls: ['./timesheet-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    TimesheetSlideSpanComponent,
    ButtonComponent,
    IconButtonComponent,
    MatMenuModule,
    MatTooltipModule,
    TimePipe,
  ],
})
export class TimesheetSlideComponent {
  private _slide!: DateSlide;
  metrics$!: Observable<TimesheetMetrics>;
  profile$!: Observable<Profile | null>;
  isExistingTimesheet$!: Observable<boolean>;

  DetailsTypes = DetailsTypes;

  @Output() selectedSlide = new EventEmitter<DateSlide>();

  @Input({ required: true })
  get slide(): DateSlide {
    return this._slide;
  }
  set slide(value: DateSlide) {
    this._slide = value;
    this.metrics$ = this.service.metricsByDate$(value.date);
    this.profile$ = this.profileService.byDate$(value.date);
    this.isExistingTimesheet$ = this.metrics$.pipe(map((metrics) => metrics != null));
  }

  constructor(private service: TimesheetService, private profileService: ProfileService) {}

  Icons = Icons;

  onSlideClick(slide: DateSlide): void {
    this.selectedSlide.emit(slide);
  }

  getTotalHoursClasses(metrics: TimesheetMetrics, profile: Profile | null) {
    if (profile == null) return {};
    const timeTarget = StringUtil.timeToNumber(profile.timeTarget);
    const workedHours = metrics.workedHours ?? 0;
    const success = timeTarget <= workedHours;

    return {
      success,
      fail: !success,
    };
  }

  getTasksClasses(metrics: TimesheetMetrics, profile: Profile | null) {
    if (profile == null) return {};
    const tasksTarget = profile.tasksTarget ?? 0;
    const totalTasks = metrics.totalTasks ?? 0;
    const success = tasksTarget <= totalTasks;

    return {
      success,
      fail: !success,
    };
  }

  onSlideMenuClick(type: DetailsTypes): void {
    this.service.handleSlideMenuClick(this.slide.date, type);
  }

  getTitleTooltip(): string {
    const { isToday, month, year } = this.slide;
    return `${isToday ? 'Today, ' : ' '} ${month} ${year}`;
  }
}
