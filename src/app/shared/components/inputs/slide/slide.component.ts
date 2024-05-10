import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormUtil } from 'src/app/util';
import { FormLayoutComponent } from '../../layouts/form-layout/form-layout.component';

@Component({
  selector: 'app-slide',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSlideToggleModule],
  template: `
    <div [formGroup]="fg">
      <mat-slide-toggle
        [formControlName]="fcName"
        [id]="id"
        color="primary"
        [ngStyle]="styles"
        (change)="onChange($event)"
      >
        {{ labelText }}
      </mat-slide-toggle>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnChanges {
  @Input() fcName!: string;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() styles: Record<string, string> = {};

  @Output() changed = new EventEmitter<boolean>();

  get control(): AbstractControl | null {
    return this.fg.controls[this.fcName];
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
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

  onChange(event: MatSlideToggleChange): void {
    this.changed.emit(event.checked);
  }
}
