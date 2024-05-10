import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CanDeactivateForm } from 'src/app/models';
import { DetailsTypes, FormTypes } from 'src/app/util';
import {
  UserCreateForm,
  UserCreateFormGroup,
  getUserCreateForm,
} from '../components/user-form/user-form-group';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent implements OnInit, CanDeactivateForm<UserCreateForm> {
  form!: UserCreateFormGroup;

  formType = FormTypes.Create;

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.initForm();

    this.loadData();
  }

  initForm(): void {
    this.form = UserCreateFormGroup.from(getUserCreateForm());
  }

  async loadData(): Promise<void> {
    await this.service.loadCreateData();
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const value = UserCreateFormGroup.toJson(this.form);

    const { id } = await this.service.insert({
      ...value,
      userRoles: value.roleIds?.map((x) => ({
        roleId: x,
      })),
    });

    this.service.goToDetails(id, DetailsTypes.View);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
