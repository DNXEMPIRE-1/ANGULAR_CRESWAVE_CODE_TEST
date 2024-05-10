import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormLayoutComponent } from '../../layouts/form-layout/form-layout.component';
import { FormUtil } from 'src/app/util';

@Component({
  selector: 'app-checkbox [fcName]  [labelText]',
  template: `<div [formGroup]="fg">
    <mat-checkbox [formControlName]="fcName" [id]="id" color="primary" (change)="onChange($event)">
      {{ labelText }}
    </mat-checkbox>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatCheckboxModule],
})
export class CheckboxComponent implements OnChanges {
  @Input() fcName!: string;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() canEdit = true;

  @Output() changed = new EventEmitter<boolean>();

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get control(): AbstractControl | null {
    return this.fg.controls[this.fcName];
  }

  get id(): string {
    return this.elId || FormUtil.buildId(this.fcName, this.formId);
  }

  get formId() {
    return this.formWrapper.id;
  }

  get fg(): FormGroup {
    return this.formWrapper.formGroup;
  }

  constructor(public formWrapper: FormLayoutComponent) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] || changes['canEdit']) this.changeControlEnabled();
  }

  changeControlEnabled(): void {
    if (this.canEdit) this.control?.enable();
    else this.control?.disable();
  }

  onChange(event: MatCheckboxChange): void {
    this.changed.emit(event.checked);
  }
}
