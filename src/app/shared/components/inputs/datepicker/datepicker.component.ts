import { DatePipe, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntil } from 'rxjs';
import { FormLayoutComponent } from '../../layouts/form-layout/form-layout.component';
import { Nullish, WithDestroyed } from 'src/app/models';
import { LoadingService } from 'src/app/services';
import { FormUtil } from 'src/app/util';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-datepicker [fcName] [labelText]',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    LoadingComponent,
    DatePipe,
  ],
})
export class DatepickerComponent extends WithDestroyed implements OnInit, OnChanges, OnDestroy {
  @Input() fcName!: string;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() canEdit = true;
  @Input() dateFilterFn: DateFilterFn<Date | undefined> | Nullish;

  isLoading = false;

  get formId() {
    return this.formWrapper.id || '';
  }

  get fg() {
    return this.formWrapper.formGroup;
  }

  get invalid(): boolean {
    return !!this.control && this.control.invalid && this.control.touched;
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get control(): AbstractControl | null {
    return this.fg.controls[this.fcName];
  }

  get id(): string {
    return this.elId || FormUtil.buildId(this.fcName, this.formId);
  }

  get canEditSelf(): boolean {
    return this.canEdit && this.formWrapper.canEdit;
  }

  constructor(
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef,
    public formWrapper: FormLayoutComponent
  ) {
    super();
  }

  ngOnInit() {
    FormUtil.updateStatusOnFormChange(this.fg, this.destroyed$, () => this.changeControlEnabled());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId'] && !!this.elId) {
      this.initLoadingSubscription();
    }
    if (changes['fcName'] || changes['canEdit']) {
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
    if (!this.isLoading && this.canEditSelf) this.control?.enable();
    else this.control?.disable();
  }

  getErrText(): string {
    return 'Invalid date!';
  }

  dateFilter: DateFilterFn<Date | Nullish> = (d) => {
    if (!this.dateFilterFn) return true;
    return this.dateFilterFn(d);
  };
}
