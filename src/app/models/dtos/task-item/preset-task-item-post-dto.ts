import { IgnoreMap } from 'mapper-ts/lib-esm';

@IgnoreMap('id')
export class PresetTaskItemPostDto {
  title?: string;
  time?: number;
  comment?: string;
}
