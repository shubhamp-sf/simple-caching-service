import {AnyObject, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {Common} from '../models';
import {CommonRepository} from '../repositories';

export const OPERATION_SECURITY_SPEC = [{HTTPBearer: []}];

export class RedisController {
  constructor(
    @repository(CommonRepository)
    public redisRepository: CommonRepository,
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
    @param.query.object('options')
    options: AnyObject,
  ): Promise<Common> {
    const getResponse = await this.redisRepository.get(key, options);
    return getResponse;
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
    await this.redisRepository.set(key, value, options);
    return {
      success: true,
    };
  }
}
