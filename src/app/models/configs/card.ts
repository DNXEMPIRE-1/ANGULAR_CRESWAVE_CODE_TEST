import { Image } from './image';

export interface Card {
  id: string;
  title: string;
  content: string;
  url: string;
  image: Image;
}
