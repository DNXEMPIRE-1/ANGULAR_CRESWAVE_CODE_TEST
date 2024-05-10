import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Card } from 'src/app/models';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-cards-grid [cards]',
  templateUrl: './cards-grid.component.html',
  styleUrls: ['./cards-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, CardComponent, RouterLink],
})
export class CardsGridComponent {
  @Input() cards!: Card[];
}
