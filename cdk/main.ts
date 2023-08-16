import {App} from 'cdktf';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {resolve} from 'path';
import {LambdaStack, RedisStack} from './common';

dotenv.config();
dotenvExt.load({
  schema: '.env.example',
  errorOnMissing: true,
  includeProcessEnv: true,
});

const app = new App();

const getSubnetIds = () => {
  try {
    const subnetIds = process.env?.SUBNET_IDS || '';
    return JSON.parse(subnetIds);
  } catch (e) {
    console.error(e); // NOSONAR
  }
  return [];
};

const getSecurityGroup = () => {
  try {
    const securityGroup = process.env?.SECURITY_GROUPS || '';
    return JSON.parse(securityGroup);
  } catch (e) {
    console.error(e); // NOSONAR
  }
  return [];
};

new LambdaStack(app, 'lambda', {
  // NOSONAR
  s3Bucket: process.env.S3_BUCKET!,
  codePath: __dirname,
  handler: 'lambda.handler',
  runtime: 'nodejs16.x',
  layerPath: resolve(__dirname, '../layers'),
  vpcConfig: {
    securityGroupIds: getSecurityGroup(),
    subnetIds: getSubnetIds(),
  },
  memorySize: 256,
  timeout: 30,
  envVars: {
    REDIS_URL: process.env.REDIS_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_ISSUER: 'sourcefuse',
  },
  customDomainName: {
    domainName: process.env.DOMAIN_NAME || '',
    hostedZoneId: process.env.HOSTED_ZONE_ID || '',
  },
  namespace: process.env.NAMESPACE || '',
  environment: process.env.ENV || '',
  useImage: true,
});

new RedisStack(app, 'redis', {
  // NOSONAR
  namespace: process.env.NAMESPACE || '',
  environment: process.env.ENV || '',
});

app.synth();
