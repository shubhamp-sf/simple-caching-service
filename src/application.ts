import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Constructor} from '@loopback/core';
import {SecuritySchemeObject} from '@loopback/openapi-v3';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  AuthenticationBindings,
  AuthenticationComponent,
  EntityWithIdentifier,
  Strategies,
} from 'loopback4-authentication';
import path from 'path';
import {User} from './models/user.model';
import {BearerTokenVerifyProvider} from './providers/verifyBearerToken';
import {MySequence} from './sequence';

export const SECURITY_SCHEME_SPEC: Record<string, SecuritySchemeObject> = {
  HTTPBearer: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};

export {ApplicationConfig};

export class SimpleCachingServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.bind(AuthenticationBindings.USER_MODEL).to(
      User as Constructor<EntityWithIdentifier>,
    );

    this.component(AuthenticationComponent);

    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Simple Caching Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
