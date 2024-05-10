import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { ElementIds, FormTypes, FormUtil, deleteModalData, saveModalData } from 'src/app/util';
import { ProfileFormGroup } from './profile-form-group';
import { NgIf, AsyncPipe } from '@angular/common';
import { ScrollToDirective } from '../../../../directives/scroll-to.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { InputComponent } from 'src/app/shared/components/inputs/input/input.component';
import { SelectComponent } from 'src/app/shared/components/inputs/select/select.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { PresetTaskItemService } from '../../services/preset-task-item.service';

@Component({
  selector: 'app-profile-form [cancel]',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormLayoutComponent,
    ScrollToDirective,
    InputComponent,
    SelectComponent,
    NgIf,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class ProfileFormComponent {
  private service = inject(ProfileService);
  private taskService = inject(PresetTaskItemService);

  private modalService = inject(ModalService);

  @Input({ required: true }) form!: ProfileFormGroup;
  @Input({ required: true }) formType!: FormTypes;

  @Output() save = new EventEmitter<ProfileFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

  taskOptions$ = this.taskService.taskOptions$;
  typeOptions$ = this.service.typeOptions$;

  get submitLabel(): string {
    return FormUtil.getSubmitLabel(this.formType);
  }

  get canEdit(): boolean {
    return !FormUtil.isViewForm(this.formType);
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
}
