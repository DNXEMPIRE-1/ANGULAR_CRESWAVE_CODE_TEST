import { Injector, Pipe, PipeTransform, ProviderToken } from '@angular/core';
import { Nullish } from '../models';

@Pipe({
  name: 'dynamic',
  standalone: true,
})
export class DynamicPipe<P extends PipeTransform> implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(value: unknown, pipeToken: ProviderToken<P>, pipeArgs: unknown[] | Nullish): unknown {
    if (!pipeToken || value == null) return value;

    const pipe = this.injector.get(pipeToken);

    if (!pipeArgs) return pipe.transform(value);

    return pipe.transform(value, ...pipeArgs);
  }
}
