// redis.service.ts

import {inject, injectable} from '@loopback/core';
import {AnyObject} from 'loopback-datasource-juggler';
import {RedisDataSource} from '../datasources';

@injectable()
export class RedisService {
  constructor(
    @inject('datasources.redis') private redisDataSource: RedisDataSource,
  ) { }

  async executeRedisCommand(
    command: string,
    args: any[],
  ): Promise<AnyObject | undefined> {
    return new Promise<AnyObject | undefined>((resolve, reject) => {
      this.redisDataSource.connector?.execute?.(
        command,
        args,
        (err: Error, res: AnyObject) => {
          if (err) {
            console.error(err);
            reject(err);
          } if (res) {
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
