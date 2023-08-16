import {Model, model} from '@loopback/repository';

@model({settings: {strict: false}})
export class Common extends Model {
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Common>) {
    super(data);
  }
}

export interface CommonRelations {
  // describe navigational properties here
}

export type CommonWithRelations = Common & CommonRelations;
