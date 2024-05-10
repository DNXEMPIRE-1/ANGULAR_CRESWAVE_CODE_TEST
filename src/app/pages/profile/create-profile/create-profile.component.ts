import { Component, OnInit } from '@angular/core';
import { CanDeactivateForm } from 'src/app/models';
import {
  ProfileForm,
  ProfileFormGroup,
  getProfileForm,
} from 'src/app/pages/profile/components/profile-form';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { DetailsTypes, FormTypes } from 'src/app/util';
import { ProfileFormComponent } from '../components/profile-form/profile-form.component';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  standalone: true,
  imports: [ProfileFormComponent],
})
export class CreateProfileComponent implements OnInit, CanDeactivateForm<ProfileForm> {
  form!: ProfileFormGroup;

  formType = FormTypes.Create;

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.initForm();

    this.loadData();
  }

  initForm(): void {
    this.form = ProfileFormGroup.from(getProfileForm());
  }

  async loadData(): Promise<void> {
    await this.service.loadCreateData();
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const { id } = await this.service.insert(this.service.toJson(this.form));

    this.service.goToDetails(id, DetailsTypes.View);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
