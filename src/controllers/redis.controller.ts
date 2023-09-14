import {inject} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {Common} from '../models';
import {CommonRepository} from '../repositories';
import {RedisService} from '../services/redis.service';

export const OPERATION_SECURITY_SPEC = [{HTTPBearer: []}];

export class RedisController {
  constructor(
    @repository(CommonRepository)
    public redisRepository: CommonRepository,
    @inject('services.RedisService') private redisService: RedisService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @get('/get/{key}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Returns value of the specified key',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async get(
    @param.path.string('key')
    key: string,
    @param.query.string('dataSource') dataSource: string,
    @param.query.object('options')
    options: AnyObject,
  ): Promise<Common> {
    const getResponse = await this.redisService.executeRedisCommand(
      'GET',
      [key],
      dataSource,
    );

    //const getResponse = await this.redisRepository.get(key, options);
    return JSON.parse(getResponse + '');
  }

  @authenticate(STRATEGY.BEARER)
  @post('/set/{key}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Saved',
      },
    },
  })
  async set(
    @param.path.string('key')
    key: string,
    @param.query.string('dataSource') dataSource: string,
    @param.query.object('options')
    options: AnyObject,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Common, {
            title: 'Value',
            exclude: [],
          }),
        },
      },
    })
    value: Common,
  ): Promise<{success: boolean}> {
    await this.redisService.executeRedisCommand(
      'SET',
      [key, JSON.stringify(value), 'PX', 86400000],
      dataSource,
    );
    //await this.redisRepository.set(key, value, options);
    return {
      success: true,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @del('/flush/{key}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Deleted',
      },
    },
  })
  async flush(
    @param.path.string('key')
    key: string,
    @param.query.string('dataSource') dataSource: string,
  ): Promise<{success: boolean}> {
    await this.redisService.executeRedisCommand('DEL', [key], dataSource);
    //await this.redisRepository.delete(key);
    return {
      success: true,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @del('/flushall', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Deleted',
      },
    },
  })
  async flushAll(
    @param.query.string('dataSource') dataSource: string,
  ): Promise<{success: boolean}> {
    await this.redisService.executeRedisCommand('flushdb', [], dataSource);
    return {
      success: true,
    };
  }
}
