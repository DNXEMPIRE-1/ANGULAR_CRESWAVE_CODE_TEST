import { Component, OnInit, inject } from '@angular/core';
import { CanDeactivateForm } from 'src/app/models';
import {
  PresetTaskItemForm,
  PresetTaskItemFormGroup,
  getPresetTaskItemForm,
} from 'src/app/pages/profile/components/preset-task-item-form/preset-task-item-form-group';
import { DetailsTypes, FormTypes } from 'src/app/util';
import { PresetTaskItemFormComponent } from '../components/preset-task-item-form/preset-task-item-form.component';
import { PresetTaskItemService } from '../services/preset-task-item.service';

@Component({
  selector: 'app-create-preset-task-item',
  templateUrl: './create-preset-task-item.component.html',
  styleUrls: ['./create-preset-task-item.component.scss'],
  standalone: true,
  imports: [PresetTaskItemFormComponent],
})
export class CreatePresetTaskItemComponent
  implements OnInit, CanDeactivateForm<PresetTaskItemForm>
{
  private service = inject(PresetTaskItemService);

  form!: PresetTaskItemFormGroup;

  formType = FormTypes.Create;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = PresetTaskItemFormGroup.from(getPresetTaskItemForm());
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
