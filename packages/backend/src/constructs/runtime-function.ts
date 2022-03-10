import * as aws_lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { CatGirlTable } from './cat-girl-table';
import { CatGirlFiles } from './cat-girl-files';
import {
  ENV_CAT_GIRL_FILES,
  ENV_CAT_GIRL_LOG_LEVEL,
  ENV_CAT_GIRL_TABLE,
} from '../constants';

export interface RuntimeFunctionProps {
  readonly handler: string;
  readonly catGirlTable: CatGirlTable;
  readonly catGirlFiles: CatGirlFiles;
  readonly logLevel?: RuntimeFunctionLogLevel;
}

export enum RuntimeFunctionLogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  ERROR = 'error',
}

export class RuntimeFunction extends aws_lambda.Function {
  constructor(scope: Construct, id: string, props: RuntimeFunctionProps) {
    super(scope, id, {
      code: aws_lambda.Code.fromAsset('dist/packages/backend.runtime'),
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      handler: `index.${props.handler}`,
      environment: {
        [ENV_CAT_GIRL_LOG_LEVEL]:
          props.logLevel ?? RuntimeFunctionLogLevel.DEBUG,
      },
    });

    const catGirlTable = props.catGirlTable;
    catGirlTable.grantReadWriteData(this);
    this.addEnvironment(ENV_CAT_GIRL_TABLE, catGirlTable.tableName);

    const catGirlFiles = props.catGirlFiles;
    catGirlFiles.grantReadWrite(this);
    this.addEnvironment(ENV_CAT_GIRL_FILES, catGirlFiles.bucketName);
  }
}
