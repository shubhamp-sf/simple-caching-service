import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {PreapprovalDataSource} from '../datasources';
import {Common} from '../models';

export class CommonRepository extends DefaultKeyValueRepository<Common> {
  constructor(
    @inject('datasources.preapproval') dataSource: PreapprovalDataSource,
  ) {
    super(Common, dataSource);
  }
}
