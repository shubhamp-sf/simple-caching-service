import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'redis',
  connector: 'kv-redis',
  url: process.env.REDIS_URL_PREAPPROVAL,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PreapprovalDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'preapproval';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.preapproval', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
