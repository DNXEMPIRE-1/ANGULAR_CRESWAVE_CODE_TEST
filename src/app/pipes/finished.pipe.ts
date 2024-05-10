import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'finished',
  standalone: true,
})
export class FinishedPipe implements PipeTransform {
  transform(isFinished: boolean): string {
    return isFinished ? 'Finished' : 'In progress';
  }
}
