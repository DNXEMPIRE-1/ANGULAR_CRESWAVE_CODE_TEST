import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItemPutDto } from '../task-item';
import { TimesheetNotePutDto } from './timesheet-note-put-dto';

export class TimesheetPutDto {
  id?: number;
  date?: string;
  finished?: boolean;
  @AddMap(TimesheetNotePutDto)
  timesheetNotes?: TimesheetNotePutDto[];
  @AddMap(TaskItemPutDto)
  taskItems?: TaskItemPutDto[];
}
