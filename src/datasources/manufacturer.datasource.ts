import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'manufacturer',
  connector: 'kv-redis',
  url: process.env.REDIS_URL_MANUFACTURER,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ManufacturerDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'manufacturer';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.manufacturer', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
