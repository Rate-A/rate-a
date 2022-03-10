import * as cdk from 'aws-cdk-lib';
import * as aws_s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CatGirlFiles extends aws_s3.Bucket {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
