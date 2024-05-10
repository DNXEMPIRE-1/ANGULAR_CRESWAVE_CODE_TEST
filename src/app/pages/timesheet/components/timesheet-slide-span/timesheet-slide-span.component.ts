import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icons } from 'src/app/util';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'app-timesheet-slide-span [titleText] [icon]',
  standalone: true,
  imports: [CommonModule, IconComponent, MatTooltipModule],
  template: `
    <span class="data" [ngClass]="ngClass" [matTooltip]="titleText">
      <app-icon [icon]="icon"></app-icon>
      <ng-content></ng-content>
      <ng-container *ngIf="profileText"> / {{ profileText }} </ng-container>
    </span>
  `,
  styles: [
    `
      .data {
        width: 100%;

        &.fail {
          color: var(--danger);
        }

        &.success {
          color: green;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetSlideSpanComponent {
  @Input() titleText!: string;
  @Input() icon!: Icons;
  @Input() ngClass?: object;
  @Input() profileText?: string;
  Icons = Icons;
}
