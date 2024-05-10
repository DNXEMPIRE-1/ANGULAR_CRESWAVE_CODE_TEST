import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntil } from 'rxjs';
import { WithDestroyed } from 'src/app/models';
import { LoadingService } from 'src/app/services';
import { LoadingComponent } from '../../loading/loading.component';
import { validationErrorMessages } from '../validation-errors';
import { DateRangeForm } from './date-range-form-group';
import { FormUtil } from 'src/app/util';
import { FormLayoutComponent } from '../../layouts/form-layout/form-layout.component';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    LoadingComponent,
  ],
})
export class DateRangePickerComponent extends WithDestroyed implements OnInit, OnChanges {
  private loadingService = inject(LoadingService);
  private cdRef = inject(ChangeDetectorRef);
  public formWrapper = inject(FormLayoutComponent);

  @Input() fgName!: string;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  isLoading = false;

  get invalid(): boolean {
    return !!this.controlGroup && this.controlGroup.invalid && this.controlGroup.touched;
  }

  get disabled(): boolean {
    return !!this.controlGroup?.disabled;
  }

  get controlGroup() {
    return this.fg.controls[this.fgName] as FormGroup<DateRangeForm>;
  }

  get id(): string {
    return this.elId || FormUtil.buildId(this.fgName, this.formId);
  }

  get formId() {
    return this.formWrapper.id || '';
  }

  get fg() {
    return this.formWrapper.formGroup;
  }

  ngOnInit() {
    FormUtil.updateStatusOnFormChange(this.fg, this.destroyed$, () => this.changeControlEnabled());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['formId'] && !!this.formId) || (changes['elId'] && !!this.elId)) {
      this.initLoadingSubscription();
    }

    if (changes['control'] || changes['canEdit']) {
      this.changeControlEnabled();
    }
  }

  initLoadingSubscription(): void {
    this.loadingService
      .isLoadingById$(this.elId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;

        this.changeControlEnabled();
        this.cdRef.detectChanges();
      });
  }

  changeControlEnabled(): void {
    if (!this.isLoading && this.canEdit) this.controlGroup?.enable();
    else this.controlGroup?.disable();
  }

  getErrText(): string {
    const errorKeys = Object.keys(
      this.controlGroup?.errors ?? []
    ) as (keyof typeof validationErrorMessages)[];

    return validationErrorMessages[errorKeys[0]] || 'Invalid field';
  }
}
