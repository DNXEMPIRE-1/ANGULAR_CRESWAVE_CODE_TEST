import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectOption, WithDestroyed } from 'src/app/models';
import { LoadingService } from 'src/app/services/loading.service';
import { ArrayUtil, FormUtil, PubSubUtil } from 'src/app/util';
import { FormLayoutComponent } from '../../layouts/form-layout/form-layout.component';
import { LoadingComponent } from '../../loading/loading.component';
import { validationErrorMessages } from '../validation-errors';

@Component({
  selector: 'app-select [fcName] [labelText] [options]',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    LoadingComponent,
  ],
})
export class SelectComponent extends WithDestroyed implements OnInit, OnDestroy, OnChanges {
  @Input() fcName!: string;
  @Input() labelText!: string;
  @Input() options!: SelectOption[] | null;
  @Input() placeholder = '';
  @Input() invalid?: boolean;
  @Input() helpers?: string;
  @Input() errText?: string;
  @Input() multiple = false;
  @Input() canEdit = true;
  @Input() elId = '';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() compareWithFn: (o1: unknown, o2: unknown) => boolean = (o1: unknown, o2: unknown) =>
    o1 === o2;

  isLoading = false;

  get fg() {
    return this.formWrapper?.formGroup ?? null;
  }

  get formId(): string {
    return this.formWrapper?.id ?? '';
  }

  get control(): AbstractControl | null {
    return this.fg.controls[this.fcName];
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get id(): string {
    return this.elId || FormUtil.buildId(this.fcName, this.formId);
  }

  get canEditSelf(): boolean {
    return this.canEdit && this.formWrapper?.canEdit;
  }

  constructor(
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef,
    public formWrapper: FormLayoutComponent
  ) {
    super();
  }

  ngOnInit(): void {
    FormUtil.updateStatusOnFormChange(this.fg, this.destroyed$, () => this.changeControlEnabled());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId'] && !!this.elId) {
      this.initLoadingSubscription();
    }

    if (changes['canEdit'] || changes['options']) {
      this.changeControlEnabled();
    }
  }

  initLoadingSubscription(): void {
    PubSubUtil.untilDestroyed(
      this.loadingService.isLoadingById$(this.elId),
      this.destroyed$
    ).subscribe((isLoading) => {
      this.isLoading = isLoading;

      this.changeControlEnabled();
      this.cdRef.detectChanges();
    });
  }

  changeControlEnabled(): void {
    const canEnable = !this.isLoading && this.hasOptions() && this.canEditSelf;
    if (canEnable) {
      this.control?.enable();
    } else {
      this.control?.disable();
    }
  }

  hasOptions(): boolean {
    return !ArrayUtil.isEmpty(this.options);
  }

  getErrText(): string {
    const errorKeys = Object.keys(
      this.control?.errors ?? []
    ) as (keyof typeof validationErrorMessages)[];

    return validationErrorMessages[errorKeys[0]] || 'Invalid field';
  }
}
