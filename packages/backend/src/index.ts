import * as cdk from 'aws-cdk-lib';
import {
  CatGirlApi,
  CatGirlFiles,
  CatGirlSpa,
  CatGirlTable,
} from './constructs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'rate-a');

new CatGirlApi(stack, 'Api', {
  catGirlTable: new CatGirlTable(stack, 'Table'),
  catGirlFiles: new CatGirlFiles(stack, 'Files'),
});

new CatGirlSpa(stack, 'Spa');

app.synth();
