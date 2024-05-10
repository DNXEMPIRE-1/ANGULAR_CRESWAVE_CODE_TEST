import { DatePipe, DecimalPipe } from '@angular/common';
import { AddMap } from 'mapper-ts/lib-esm';
import { FinishedPipe, TimePipe } from 'src/app/pipes';
import { TableItemConfig } from '../configs';
import { TimesheetMetricsDto } from '../dtos';
import { TableItem } from '../types';
import { TaskItem } from './task-item';
import { TimesheetNote } from './timesheet-note';

export class Timesheet implements TableItem {
  id?: number;
  date?: string;
  userId?: number;
  finished?: boolean;
  @AddMap(TimesheetNote)
  notes?: TimesheetNote[];
  @AddMap(TaskItem)
  tasks?: TaskItem[];

  metrics?: TimesheetMetricsDto;

  static tableItems = (): TableItemConfig<Timesheet>[] => [
    {
      header: '#',
      key: 'id',
      hiddenInLowRes: true,
    },
    {
      header: 'Date',
      key: 'date',
      pipe: DatePipe,
      styles: {
        minWidth: '160px',
      },
    },
    { header: 'Completion', key: 'finished', pipe: FinishedPipe, hiddenInLowRes: true },
    {
      header: 'Tasks',
      key: ['metrics', 'totalTasks'],
      hiddenInLowRes: true,
      defaultsTo: 0,
      disabledOrderBy: true,
    },
    {
      header: 'Hours',
      key: ['metrics', 'workedHours'],
      defaultsTo: 0,
      disabledOrderBy: true,
      pipe: TimePipe,
    },
    {
      header: 'Rating',
      key: ['metrics', 'averageRating'],
      disabledOrderBy: true,
      pipe: DecimalPipe,
      pipeArgs: ['1.1-2'],
    },
  ];
}
