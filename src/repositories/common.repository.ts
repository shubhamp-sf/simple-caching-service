import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {RedisDataSource} from '../datasources';
import {Common} from '../models';

export class CommonRepository extends DefaultKeyValueRepository<Common> {
  constructor(@inject('datasources.redis') dataSource: RedisDataSource) {
    super(Common, dataSource);
  }
}
