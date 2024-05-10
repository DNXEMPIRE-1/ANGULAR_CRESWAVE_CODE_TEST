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
import { ScrollToDirective } from 'src/app/directives';
import { ModalService } from 'src/app/services';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { InputComponent } from 'src/app/shared/components/inputs/input/input.component';
import { SelectComponent } from 'src/app/shared/components/inputs/select/select.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { ElementIds, FormTypes, FormUtil, saveModalData } from 'src/app/util';
import { MyProfileFormGroup } from './my-profile-form-group';

@Component({
  selector: 'app-my-profile-form',
  templateUrl: './my-profile-form.component.html',
  styleUrls: ['./my-profile-form.component.scss'],
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
export class MyProfileFormComponent {
  private modalService = inject(ModalService);

  @Input() form!: MyProfileFormGroup;

  @Output() save = new EventEmitter<MyProfileFormGroup>();
  @Output() cancel = new EventEmitter<void>();

  formType = FormTypes.Edit;
  elIds = ElementIds;

  get submitLabel(): string {
    return FormUtil.getSubmitLabel(this.formType);
  }

  get controls() {
    return this.form.controls;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  openSaveModal(): void {
    this.modalService.confirmation(saveModalData(), () => FormUtil.onSubmit(this.form, this.save));
  }
}
