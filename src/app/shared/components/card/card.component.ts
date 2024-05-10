import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Card } from 'src/app/models';
import { CardLayoutComponent } from '../layouts/card-layout/card-layout.component';

@Component({
  selector: 'app-card [card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CardLayoutComponent],
})
export class CardComponent {
  @Input() card!: Card;
}
