import * as lambda from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { getExpressApp } from './express-app';

const app = getExpressApp();

export const handler: lambda.APIGatewayProxyHandler = serverlessExpress({
  app,
});
