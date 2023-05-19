import { Document } from 'mongoose';

export type Event = {
  name: string;
  operation: string;
  value: number;
};

export interface ICategory extends Document {
  readonly category: string;
  description: string;
  events: Event[];
}
