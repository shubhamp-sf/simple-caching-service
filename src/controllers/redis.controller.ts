// Uncomment these imports to begin using these cool features!

import {AnyObject, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Common} from '../models';
import {CommonRepository} from '../repositories';

// import {inject} from '@loopback/core';

export class RedisController {
  constructor(
    @repository(CommonRepository)
    public redisRepository: CommonRepository,
  ) {}

  @get('/get/{key}')
  @response(200)
  async get(
    @param.path.string('key')
    key: string,
    @param.query.object('options')
    options: AnyObject,
  ): Promise<Common> {
    const getResponse = await this.redisRepository.get(key);
    return getResponse;
  }

  @post('/set/{key}')
  @response(201)
  async post(
    @param.path.string('key')
    key: string,

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
  ): Promise<void> {
    await this.redisRepository.set(key, value, options);
  }
}
