import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValue, Timesheet } from 'src/app/models';
import { DateUtil } from 'src/app/util';

export class TimesheetFormGroup extends FormGroup<TimesheetForm> {
  static from(form: TimesheetForm): TimesheetFormGroup {
    return new TimesheetFormGroup(form);
  }

  static getFormKeys(): (keyof TimesheetForm)[] {
    return ['date', 'finished', 'notes'];
  }

  static toJson = (fg: TimesheetFormGroup): Partial<Timesheet> => {
    const value = fg.getRawValue();
    const tasks = value.tasks.map((task) => {
      let title = '';
      if (!task.presetTaskItemId) {
        title = task.title ?? '';
      }
      return {
        ...task,
        title,
        rating: task.rating ?? 0,
      };
    });

    return {
      ...value,
      date: DateUtil.formatDateToUniversalFormat(value.date),
      tasks,
    } as Partial<Timesheet>;
  };
}

export interface TimesheetForm {
  id: FormControl<number | null>;
  date: FormControl<Date>;
  finished: FormControl<boolean>;
  notes: FormArray<FormGroup<TimesheetNoteForm>>;
  tasks: FormArray<FormGroup<TaskItemForm>>;
}

export type TimesheetFormValue = FormValue<TimesheetForm>;

export interface TimesheetNoteForm {
  id: FormControl<number | null>;
  comment: FormControl<string>;
}

export const getTimesheetNoteFormGroup = (): FormGroup<TimesheetNoteForm> => {
  return new FormGroup(getTimesheetNoteForm());
};

export const getTimesheetNoteForm = (): TimesheetNoteForm => {
  return {
    id: new FormControl(null),
    comment: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  };
};

export interface TaskItemForm {
  id: FormControl<number | null>;
  presetTaskItemId: FormControl<number | null>;
  title: FormControl<string | null>;
  comment: FormControl<string | null>;
  time: FormControl<string>;
  rating: FormControl<number | null>;
}

export const getTaskItemFormGroup = (): FormGroup<TaskItemForm> => {
  return new FormGroup(getTaskItemForm());
};

export const getTaskItemForm = (): TaskItemForm => {
  return {
    id: new FormControl(null),
    presetTaskItemId: new FormControl<number | null>(null),
    title: new FormControl('', {
      validators: [Validators.maxLength(100)],
    }),
    comment: new FormControl(''),
    time: new FormControl('00:00', { nonNullable: true }),
    rating: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(5)],
    }),
  };
};

export const getTimesheetForm = (initialDate: Date): TimesheetForm => {
  return {
    id: new FormControl(null),
    date: new FormControl(initialDate, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    finished: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    notes: new FormArray<FormGroup<TimesheetNoteForm>>([]),
    tasks: new FormArray<FormGroup<TaskItemForm>>([]),
  };
};

export const getTimesheetFormInitialValues = (initialDate: Date): Partial<TimesheetFormValue> => {
  return {
    date: initialDate,
    finished: false,
    notes: [],
    tasks: [],
  };
};
