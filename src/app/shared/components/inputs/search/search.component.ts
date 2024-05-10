import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IconConfig } from 'src/app/models';
import { Icons } from 'src/app/util';
import { InputComponent } from '../input/input.component';
import { FormLayoutComponent } from '../../layouts/form-layout/form-layout.component';

@Component({
  selector: 'app-search [fcName]  [labelText]',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [InputComponent],
})
export class SearchComponent {
  @Input() fcName!: string;
  @Input() labelText!: string;
  @Input() errText = 'Invalid Filter';
  @Input() placeholder = '';
  @Input() elId = '';
  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  @Output() filter = new EventEmitter<string>();
  @Output() keydownPressed = new EventEmitter<KeyboardEvent>();
  @Output() apply = new EventEmitter<void>();

  searchIcon = IconConfig.withClick('cSearchIcon', Icons.Search, () => this.apply.emit());

  get fg() {
    return this.formWrapper?.formGroup ?? null;
  }

  get control(): AbstractControl | null {
    return this.fg.controls[this.fcName];
  }

  get invalid(): boolean {
    return this.isInvalid();
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  constructor(public formWrapper: FormLayoutComponent) {}

  onKeydown(ev: KeyboardEvent): void {
    const searchValue = this.fg.controls[this.fcName].value.trim().toLowerCase();

    this.filter.emit(searchValue);
    this.keydownPressed.emit(ev);
    if (ev.code === 'Enter') this.apply.emit();
  }
}
