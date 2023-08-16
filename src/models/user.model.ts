import {Entity, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';

@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'username',
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    name: 'environment',
  })
  environment: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
