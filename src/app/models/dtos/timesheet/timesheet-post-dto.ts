import { AddMap, IgnoreMap } from 'mapper-ts/lib-esm';
import { TaskItemPostDto } from '../task-item';
import { TimesheetNotePostDto } from './timesheet-note-post-dto';

@IgnoreMap('id')
export class TimesheetPostDto {
  date?: string;
  finished?: boolean;
  @AddMap(TimesheetNotePostDto)
  timesheetNotes?: TimesheetNotePostDto[];
  @AddMap(TaskItemPostDto)
  taskItems?: TaskItemPostDto[];
}
