import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '<a class="link" [routerLink]="to"><ng-content></ng-content></a>',
  styles: [
    `
      .link {
        text-decoration: none;
        color: var(--primary-dark);
        font-size: 20px;
        font-family: 'Poppins', sans-serif;
        transition: color 0.2s ease-in-out;

        &:hover {
          color: var(--primary);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  @Input() to = '';
}
