import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ModalConfirmData } from 'src/app/models';
import { FocusInitialDirective } from '../../../../directives/focus-initial.directive';
import { ButtonComponent } from '../../buttons/button/button.component';
import { ModalLayoutComponent } from '../../layouts/modal-layout/modal-layout.component';

@Component({
  selector: 'app-modal-feedback',
  templateUrl: './modal-feedback.component.html',
  styleUrls: ['./modal-feedback.component.scss'],
  standalone: true,
  imports: [ModalLayoutComponent, ButtonComponent, FocusInitialDirective, MatDialogModule],
})
export class ModalFeedbackComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalConfirmData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
