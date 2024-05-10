import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'src/app/models';
import { CardsGridComponent } from 'src/app/shared/components/cards-grid/cards-grid.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { homeCards } from 'src/app/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TitleComponent, CardsGridComponent],
})
export class HomeComponent {
  cards: Card[] = homeCards;
}
