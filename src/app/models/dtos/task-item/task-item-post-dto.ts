import { IgnoreMap } from 'mapper-ts/lib-esm';

@IgnoreMap('id')
export class TaskItemPostDto {
  title?: string;
  time?: number;
  rating?: number;
  timesheetId?: number;
  comment?: string;
  presetTaskItemId?: number;
}
