import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AppService, ModalService } from 'src/app/services';
import {
  ElementIds,
  FormTypes,
  FormUtil,
  PubSubUtil,
  deleteModalData,
  saveModalData,
} from 'src/app/util';
import {
  TaskItemForm,
  TimesheetForm,
  TimesheetFormGroup,
  TimesheetNoteForm,
  getTaskItemFormGroup,
  getTimesheetNoteFormGroup,
} from './timesheet-form-group';

import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ScrollToDirective } from 'src/app/directives';

import { MatTooltipModule } from '@angular/material/tooltip';
import { PresetTaskItem } from 'src/app/models';
import { PresetTaskItemService } from 'src/app/pages/profile/services/preset-task-item.service';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { CheckboxComponent } from 'src/app/shared/components/inputs/checkbox/checkbox.component';
import { DatepickerComponent } from 'src/app/shared/components/inputs/datepicker/datepicker.component';
import { InputComponent } from 'src/app/shared/components/inputs/input/input.component';
import { TextareaComponent } from 'src/app/shared/components/inputs/textarea/textarea.component';
import { FixedButtonsLayoutComponent } from 'src/app/shared/components/layouts/fixed-buttons-layout/fixed-buttons-layout.component';
import { FormArrayLayoutComponent } from 'src/app/shared/components/layouts/form-array-layout/form-array-layout.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-timesheet-form',
  templateUrl: './timesheet-form.component.html',
  styleUrls: ['./timesheet-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormLayoutComponent,
    NgIf,
    DatepickerComponent,
    ScrollToDirective,
    FormArrayLayoutComponent,
    NgFor,
    TextareaComponent,
    MatTooltipModule,
    ButtonComponent,
    InputComponent,
    CheckboxComponent,
    FixedButtonsLayoutComponent,
    AsyncPipe,
  ],
})
export class TimesheetFormComponent implements OnInit, OnDestroy {
  private service = inject(TimesheetService);
  private modalService = inject(ModalService);
  private app = inject(AppService);
  private taskService = inject(PresetTaskItemService);
  private cdRef = inject(ChangeDetectorRef);

  @Input() form!: TimesheetFormGroup;
  @Input() formType!: FormTypes;

  @Output() save = new EventEmitter<TimesheetFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  dateRangeOrDefault$ = this.app.dateRangeOrDefault$;
  dateFilterFn$ = this.service.dateFilterFn$;

  destroyed$ = new Subject<boolean>();

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

  get controls(): TimesheetForm {
    return this.form.controls;
  }

  get noteForms() {
    return this.controls.notes;
  }

  get taskForms() {
    return this.controls.tasks;
  }

  get submitLabel(): string {
    return FormUtil.getSubmitLabel(this.formType);
  }

  get canEdit(): boolean {
    return !FormUtil.isViewForm(this.formType);
  }

  get canEditDate(): boolean {
    return (
      (this.canEdit && FormUtil.isDuplicateForm(this.formType)) ||
      FormUtil.isCreateForm(this.formType)
    );
  }

  private presetTasks: PresetTaskItem[] = [];

  ngOnInit(): void {
    this.taskService.loadTasks();
    this.taskService.tasks$.pipe(takeUntil(this.destroyed$)).subscribe((tasks) => {
      this.presetTasks = tasks;
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.form.reset();
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  addNote(): void {
    this.noteForms.push(getTimesheetNoteFormGroup());
  }

  removeNote(index: number): void {
    this.noteForms.removeAt(index);
  }

  addTask(): void {
    this.taskForms.push(getTaskItemFormGroup());
  }

  removeTask(index: number): void {
    this.taskForms.removeAt(index);
  }

  showDelete(): boolean {
    return FormUtil.isEditForm(this.formType);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  openDeleteModal(): void {
    this.modalService.confirmation(deleteModalData(), () => this.remove.emit());
  }

  openSaveModal(): void {
    this.modalService.confirmation(saveModalData(), () => FormUtil.onSubmit(this.form, this.save));
  }

  getFormItemId(index: number, item: FormGroup<TimesheetNoteForm>): number {
    return item.controls.id.value ?? index;
  }

  isPresetTask(taskForm: FormGroup<TaskItemForm>) {
    const presetTaskItemControl = taskForm.controls.presetTaskItemId;
    return presetTaskItemControl.getRawValue() != null;
  }

  getPresetTaskTitle(taskForm: FormGroup<TaskItemForm>) {
    const presetTaskItemId = taskForm.controls.presetTaskItemId.getRawValue();
    const presetTaskItem = this.presetTasks.find(
      (presetTask) => presetTask.id === presetTaskItemId
    );
    return presetTaskItem?.title;
  }
}
