import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Metrics, Nullish, TimesheetAverageMetrics } from 'src/app/models';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { Icons, StringUtil } from 'src/app/util';
import { StatsComponent } from 'src/app/shared/components/stats/stats.component';
import { Stat } from 'src/app/shared/components/stats/types';
import { AppService } from 'src/app/services';

@Component({
  selector: 'app-metrics-stats',
  standalone: true,
  imports: [CommonModule, IconComponent, StatsComponent],
  templateUrl: './metrics-stats.component.html',
  styleUrls: ['./metrics-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsStatsComponent {
  private app = inject(AppService);

  dateRange$ = this.app.dateRange$;

  @Input({ required: true }) avgMetrics!: TimesheetAverageMetrics | null;

  Icons = Icons;

  get tasksStats(): Stat[] {
    return this.toTasksStats(this.avgMetrics);
  }

  get stats(): Stat[] {
    return this.toStats(this.avgMetrics);
  }

  get dayStats(): Stat[] {
    return this.toAvgStats(this.avgMetrics?.dayAvgs, 'd');
  }

  get weekStats(): Stat[] {
    return this.toAvgStats(this.avgMetrics?.weekAvgs, 'w');
  }

  toTasksStats<T extends Metrics>(metrics: T | Nullish) {
    if (!metrics) return [];

    return [
      {
        id: 1,
        title: 'Total tasks',
        content: metrics.totalTasks,
        icon: Icons.Assignment,
      },
      {
        id: 2,
        title: 'Total hours',
        content: StringUtil.numberToTime(metrics.workedHours),
        icon: Icons.Timelapse,
      },
    ];
  }

  toStats(metrics: TimesheetAverageMetrics | Nullish) {
    if (!metrics) return [];

    return [
      {
        id: 1,
        title: 'Registered days',
        content: metrics.total,
        icon: Icons.CalendarToday,
      },
      {
        id: 2,
        title: 'Average rating',
        content: metrics.averageRating,
        icon: Icons.Star,
      },
    ];
  }

  toAvgStats(metrics: Metrics | Nullish, per: 'd' | 'w') {
    if (!metrics) return [];

    const perText = per === 'd' ? 'day' : 'week';

    return [
      {
        id: 1,
        title: 'Average tasks per ' + perText,
        content: metrics.totalTasks.toFixed(2),
        icon: Icons.Assignment,
      },
      {
        id: 2,
        title: 'Average hours per ' + perText,
        content: StringUtil.numberToTime(+metrics.workedHours.toFixed(0)),
        icon: Icons.Timelapse,
      },
    ];
  }
}
