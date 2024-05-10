/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '[app-fixed-buttons-layout]',
  templateUrl: './fixed-buttons-layout.component.html',
  styleUrls: ['./fixed-buttons-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FixedButtonsLayoutComponent {}
