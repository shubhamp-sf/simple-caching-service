// redis.service.ts

import {inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AnyObject} from 'loopback-datasource-juggler';
import {
  ManufacturerDataSource,
  PreapprovalDataSource,
  PremiumDataSource,
  RetailerDataSource,
} from '../datasources';

@injectable()
export class RedisService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSourceConfig: any;
  constructor(
    @inject('datasources.manufacturer')
    private manufacturerDataSource: ManufacturerDataSource,
    @inject('datasources.preapproval')
    private preapprovalDataSource: PreapprovalDataSource,
    @inject('datasources.premium') private premiumDataSource: PremiumDataSource,
    @inject('datasources.retailer')
    private retailerDataSource: RetailerDataSource,
  ) {}
  dataSourceMap = {
    manufacturer: this.manufacturerDataSource,
    preapproval: this.preapprovalDataSource,
    retailer: this.retailerDataSource,
    premium: this.premiumDataSource,
  };
  async executeRedisCommand(
    command: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
    dataSource?: string,
  ): Promise<AnyObject | undefined> {
    if (dataSource === 'manufacturer') {
      this.dataSourceConfig = this.dataSourceMap.manufacturer;
    } else if (dataSource === 'preapproval') {
      this.dataSourceConfig = this.dataSourceMap.preapproval;
    } else if (dataSource === 'retailer') {
      this.dataSourceConfig = this.dataSourceMap.retailer;
    } else if (dataSource === 'premium') {
      this.dataSourceConfig = this.dataSourceMap.premium;
    } else {
      throw new HttpErrors.Unauthorized('Invalid Datasource');
    }
    return new Promise<AnyObject | undefined>((resolve, reject) => {
      this.dataSourceConfig.connector?.execute?.(
        command,
        args,
        (err: Error, res: AnyObject) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (res) {
            console.log(res + '');
            resolve(res);
          } else {
            console.log(undefined);
            resolve(res);
          }
        },
      );
    });
  }
}
