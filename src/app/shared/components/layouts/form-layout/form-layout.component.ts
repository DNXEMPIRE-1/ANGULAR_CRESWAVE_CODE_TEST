/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: '[app-form-layout]',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-layout.component.html',
  styleUrls: ['./form-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLayoutComponent implements OnChanges {
  @Input() id!: string;
  @Input() formGroup!: FormGroup;
  @Input() canEdit = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['canEdit'] || changes['formGroup']) this.changeEnabled();
  }

  changeEnabled(): void {
    if (this.canEdit) this.formGroup.enable();
    else this.formGroup.disable();
  }
}
