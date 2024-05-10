import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CanDeactivateForm, PageData } from 'src/app/models';
import {
  PresetTaskItemForm,
  PresetTaskItemFormGroup,
  getPresetTaskItemForm,
} from 'src/app/pages/profile/components/preset-task-item-form/preset-task-item-form-group';
import { PageService } from 'src/app/services';
import { DetailsTypes, FormTypes, PubSubUtil } from 'src/app/util';
import { PresetTaskItemFormComponent } from '../components/preset-task-item-form/preset-task-item-form.component';
import { PresetTaskItemService } from '../services/preset-task-item.service';

@Component({
  selector: 'app-preset-task-item-details',
  templateUrl: './preset-task-item-details.component.html',
  styleUrls: ['./preset-task-item-details.component.scss'],
  standalone: true,
  imports: [PresetTaskItemFormComponent],
})
export class PresetTaskItemDetailsComponent
  implements OnInit, OnDestroy, CanDeactivateForm<PresetTaskItemForm>
{
  private service = inject(PresetTaskItemService);
  private pageService = inject(PageService);
  private cdRef = inject(ChangeDetectorRef);

  form!: PresetTaskItemFormGroup;

  pageData?: PageData | undefined;

  get formType(): FormTypes {
    if (!this.pageData?.type) return FormTypes.Edit;

    return this.pageData?.type as unknown as FormTypes;
  }

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    PubSubUtil.unsub(this.subscriptions);
  }

  runInitMethods(): void {
    this.initUrlParams();
    this.initForm();

    this.loadData();
  }

  private initSubscriptions(): void {
    this.subscriptions.push(
      this.pageService.getQueryParamsObservable().subscribe(() => {
        this.runInitMethods();
      })
    );
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
      this.form = PresetTaskItemFormGroup.from(getPresetTaskItemForm());
    }
    this.form.patchValue(this.service.convertToFormValue(loadedItem));
    this.form.markAllAsTouched();
    this.cdRef.detectChanges();
  }

  initForm(): void {
    if (this.form == null) {
      this.form = PresetTaskItemFormGroup.from(getPresetTaskItemForm());
    } else {
      this.form.patchValue({});
    }
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
