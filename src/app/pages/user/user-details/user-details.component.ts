import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CanDeactivateForm, PageData } from 'src/app/models';
import { PageService } from 'src/app/services';
import { FormTypes, PubSubUtil } from 'src/app/util';
import {
  UserForm,
  UserFormGroup,
  getUserCreateForm,
  getUserForm,
} from '../components/user-form/user-form-group';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit, OnDestroy, CanDeactivateForm<UserForm> {
  form!: UserFormGroup;

  get formType(): FormTypes {
    if (!this.pageData?.type) return FormTypes.Edit;

    return this.pageData?.type as unknown as FormTypes;
  }

  pageData?: PageData | undefined;

  subscriptions: Subscription[] = [];

  constructor(
    private service: UserService,
    private pageService: PageService,
    private cdRef: ChangeDetectorRef
  ) {}

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
      this.form = UserFormGroup.from(getUserCreateForm());
    }
    this.form.patchValue(this.service.convertToFormValue(loadedItem));
    this.form.markAllAsTouched();
    this.cdRef.detectChanges();
  }

  initForm(): void {
    if (this.form == null) {
      this.form = UserFormGroup.from(getUserForm());
    } else {
      this.form.patchValue({});
    }
  }

  submitForm(): Promise<void> {
    const submitFns: { [key: string]: () => Promise<void> } = {
      [FormTypes.Edit]: () => this.editItem(),
    };

    return submitFns[this.formType]();
  }

  async editItem(): Promise<void> {
    const value = UserFormGroup.toJson(this.form);

    await this.service.update(this.pageData?.id, {
      ...value,
      userRoles: value.roleIds?.map((x) => ({
        roleId: x,
      })),
    });
  }

  async onRemove(): Promise<void> {
    await this.service.deleteItem(this.pageData?.id);
    this.service.goToList();
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
