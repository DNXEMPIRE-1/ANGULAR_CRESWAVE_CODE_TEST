import { IgnoreMap } from 'mapper-ts/lib-esm';

@IgnoreMap('id')
export class TimesheetNotePostDto {
  comment?: string;
  timesheetId?: number;
}
