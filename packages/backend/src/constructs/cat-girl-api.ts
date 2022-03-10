import * as aws_apigateway from 'aws-cdk-lib/aws-apigateway';
import { CatGirlTable } from './cat-girl-table';
import { RuntimeFunction } from './runtime-function';
import { CatGirlFiles } from './cat-girl-files';
import { Construct } from 'constructs';

export interface CatGirlApiProps {
  readonly catGirlTable: CatGirlTable;
  readonly catGirlFiles: CatGirlFiles;
}

export class CatGirlApi extends Construct {
  constructor(scope: Construct, id: string, props: CatGirlApiProps) {
    super(scope, id);

    const handler = new RuntimeFunction(this, 'DefaultHandler', {
      handler: 'handler',
      ...props,
    });

    new aws_apigateway.LambdaRestApi(this, 'RestApi', {
      handler,
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: ['*'],
      },
    });
  }
}
