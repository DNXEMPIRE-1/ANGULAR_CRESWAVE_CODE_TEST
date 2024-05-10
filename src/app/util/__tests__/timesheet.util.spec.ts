import { TestBed } from '@angular/core/testing';

import { TimesheetUtil } from '../timesheet.util';

describe('Util: Timesheet', () => {
  let service: TimesheetUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapMetrics', () => {
    it('should map metrics', () => {
      const metrics = {
        id: 1,
        date: '2023-01-01',
        totalTasks: 1,
        workedHours: '01:30',
        averageRating: 4.5,
      };
      const expected = {
        ...metrics,
        workedHours: 130,
      };
      expect(TimesheetUtil.mapMetrics(metrics)).toEqual(expected);
    });
  });

  describe('mapMetricsToDto', () => {
    it('should map metrics', () => {
      const metrics = {
        id: 1,
        date: '2023-01-01',
        totalTasks: 1,
        workedHours: 130,
        averageRating: 4.5,
      };
      const expected = {
        ...metrics,
        workedHours: '01:30',
      };
      expect(TimesheetUtil.mapMetricsToDto(metrics)).toEqual(expected);
    });
  });
});
