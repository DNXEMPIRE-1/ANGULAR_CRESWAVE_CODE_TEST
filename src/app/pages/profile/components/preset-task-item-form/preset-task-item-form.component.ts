import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { InputComponent } from 'src/app/shared/components/inputs/input/input.component';
import { SelectComponent } from 'src/app/shared/components/inputs/select/select.component';
import { TextareaComponent } from 'src/app/shared/components/inputs/textarea/textarea.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { ElementIds, FormTypes, FormUtil, deleteModalData, saveModalData } from 'src/app/util';
import { ScrollToDirective } from '../../../../directives/scroll-to.directive';
import { PresetTaskItemFormGroup } from './preset-task-item-form-group';

@Component({
  selector: 'app-preset-task-item-form',
  templateUrl: './preset-task-item-form.component.html',
  styleUrls: ['./preset-task-item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormLayoutComponent,
    ScrollToDirective,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    NgIf,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class PresetTaskItemFormComponent {
  private modalService = inject(ModalService);

  @Input() form!: PresetTaskItemFormGroup;
  @Input() formType!: FormTypes;

  @Output() save = new EventEmitter<PresetTaskItemFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

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
