import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { IconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { Icons } from 'src/app/util';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  template: `
    <div class="content">
      <span class="data">{{ data }}</span>
      <span class="actions">
        <ng-template [ngIf]="count$ | async" let-count>
          <span *ngIf="count > 1"> 1 of {{ count }} </span>
        </ng-template>
        <app-icon-button
          (clicked)="close()"
          [icon]="Icons.Close"
          [iconSize]="20"
          [styles]="{ color: '#fff' }"
        ></app-icon-button>
      </span>
    </div>
  `,
  styles: [
    `
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }

      .data {
        margin-right: 1.5rem;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      app-icon-button {
        margin-left: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  private service = inject(ToastService);
  Icons = Icons;
  count$ = this.service.toastCount$;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}

  close(): void {
    this.service.closeToast();
  }
}
