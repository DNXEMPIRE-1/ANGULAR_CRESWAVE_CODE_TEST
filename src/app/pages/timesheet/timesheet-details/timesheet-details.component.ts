import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CanDeactivateForm, FormValue, PageData, WithDestroyed } from 'src/app/models';
import { PageService } from 'src/app/services';
import { DetailsTypes, FormTypes, FormUtil } from 'src/app/util';
import {
  TimesheetFormComponent,
  TimesheetForm,
  TimesheetFormGroup,
  getTimesheetForm,
  getTaskItemFormGroup,
  getTimesheetNoteFormGroup,
} from '../components/timesheet-form';
import { TimesheetService } from '../services/timesheet.service';

@Component({
  selector: 'app-timesheet-details',
  templateUrl: './timesheet-details.component.html',
  styleUrls: ['./timesheet-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TimesheetFormComponent],
})
export class TimesheetDetailsComponent
  extends WithDestroyed
  implements OnInit, CanDeactivateForm<TimesheetForm>
{
  private _form!: TimesheetFormGroup;
  get form(): TimesheetFormGroup {
    return this._form;
  }
  set form(value: TimesheetFormGroup) {
    this._form = value;
  }

  get formType(): FormTypes {
    if (!this.pageData?.type) return FormTypes.Edit;

    return this.pageData?.type as unknown as FormTypes;
  }

  private _pageData?: PageData | undefined;
  get pageData(): PageData | undefined {
    return this._pageData;
  }
  set pageData(value: PageData | undefined) {
    this._pageData = value;
  }

  constructor(
    private service: TimesheetService,
    private pageService: PageService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  runInitMethods(): void {
    this.initUrlParams();
    this.initForm();

    this.loadData();
  }

  private initSubscriptions(): void {
    this.pageService
      .getQueryParamsObservable()
      .pipe(
        takeUntil(this.destroyed$),
        tap(() => {
          this.runInitMethods();
        })
      )
      .subscribe();
  }

  initUrlParams(): void {
    this.pageData = this.pageService.getDetailsUrlParams();
  }

  async loadData(): Promise<void> {
    const loadedItem = await this.service.loadEditData(this.pageData?.id);

    if (loadedItem == null) {
      this.service.goToList();
      return;
    }

    if (this.form == null) {
      this.form = TimesheetFormGroup.from(getTimesheetForm(new Date()));
    }
    const value = this.service.convertToFormValue(loadedItem);
    this.setForm(value);

    this.form.markAllAsTouched();
    this.cdRef.detectChanges();
  }

  initForm(): void {
    if (this.form == null) {
      this.form = TimesheetFormGroup.from(getTimesheetForm(new Date()));
    } else {
      this.form.patchValue({ date: new Date() });
    }
  }

  setForm(value: Partial<FormValue<TimesheetForm>>) {
    this.form.patchValue(value);
    const tasksFormArray = this.form.controls.tasks;
    FormUtil.addItemsToFormArray(value?.tasks ?? [], tasksFormArray, getTaskItemFormGroup);

    const notesFormArray = this.form.controls.notes;
    FormUtil.addItemsToFormArray(value?.notes ?? [], notesFormArray, getTimesheetNoteFormGroup);
  }

  submitForm(): Promise<void> {
    const submitFns: { [key: string]: () => Promise<void> } = {
      [FormTypes.Edit]: () => this.editItem(),
      [FormTypes.Duplicate]: () => this.duplicateItem(),
    };

    return submitFns[this.formType]();
  }

  async editItem(): Promise<void> {
    await this.service.update(this.pageData?.id, this.service.toJson(this.form));
  }

  async duplicateItem(): Promise<void> {
    const { id: createdId } = await this.service.duplicate(this.service.toJson(this.form));

    this.service.goToDetails(createdId, DetailsTypes.View);
  }

  async onRemove(): Promise<void> {
    await this.service.deleteItem(this.pageData?.id);
    this.service.goToList();
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
