import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SetOptions extends Model {
  @property({
    type: 'number',
  })
  ttl?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SetOptions>) {
    super(data);
  }
}

export interface SetOptionsRelations {
  // describe navigational properties here
}

export type SetOptionsWithRelations = SetOptions & SetOptionsRelations;
