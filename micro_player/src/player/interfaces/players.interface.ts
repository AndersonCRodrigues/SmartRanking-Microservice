import { Document } from 'mongoose';
import { ICategory } from './category.interface';

export interface IPlayer extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  category: ICategory;
  name: string;
  ranking: string;
  rankingPosition: number;
  urlImagePalyer: string;
}
