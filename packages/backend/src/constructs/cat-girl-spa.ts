import * as cdk from 'aws-cdk-lib';
import * as aws_s3 from 'aws-cdk-lib/aws-s3';
import * as aws_s3_deployment from 'aws-cdk-lib/aws-s3-deployment';

import { Construct } from 'constructs';

export class CatGirlSpa extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new aws_s3.Bucket(this, 'Bucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });
    bucket.grantPublicAccess();

    new aws_s3_deployment.BucketDeployment(this, 'BucketDeployment2', {
      destinationBucket: bucket,
      sources: [aws_s3_deployment.Source.asset('dist/packages/frontend')],
    });

    new cdk.CfnOutput(this, 'BucketUrl', {
      value: bucket.bucketWebsiteUrl,
    });
  }
}
