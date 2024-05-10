import { Injectable } from '@angular/core';
import { TimesheetMetrics, TimesheetMetricsDto } from '../models';
import { StringUtil } from './string.util';

@Injectable({
  providedIn: 'root',
})
export class TimesheetUtil {
  static mapMetrics(
    metrics: Required<TimesheetMetricsDto> | undefined
  ): TimesheetMetrics | undefined {
    if (!metrics) return metrics;

    return { ...metrics, workedHours: StringUtil.timeToNumber(metrics?.workedHours ?? '') };
  }

  static mapMetricsToDto(metrics: TimesheetMetrics | undefined): TimesheetMetricsDto | undefined {
    if (!metrics) return metrics;

    return { ...metrics, workedHours: StringUtil.numberToTime(metrics?.workedHours ?? 0) };
  }
}
