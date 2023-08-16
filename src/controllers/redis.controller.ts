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
import {STRATEGY, authenticate} from 'loopback4-authentication';

export class RedisController {
  constructor(
    @repository(CommonRepository)
    public redisRepository: CommonRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @get('/get/{key}', {
    security: [{HTTPBearer: []}],
    responses: {
      200: {
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
  @response(200)
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
