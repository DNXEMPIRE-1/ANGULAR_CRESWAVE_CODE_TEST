import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Stat } from './types';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  @Input({ required: true }) stats!: Stat[];

  getItemKey(index: number, item: Stat): number {
    return item.id;
  }
}
