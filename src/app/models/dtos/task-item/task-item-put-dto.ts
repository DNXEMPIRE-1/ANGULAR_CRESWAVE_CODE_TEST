export class TaskItemPutDto {
  id?: number;
  title?: string;
  time?: number;
  rating?: number;
  timesheetId?: number;
  comment?: string;
  presetTaskItemId?: number;
}
