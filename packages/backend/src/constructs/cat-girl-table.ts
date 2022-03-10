import * as cdk from 'aws-cdk-lib';
import * as aws_dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class CatGirlTable extends aws_dynamodb.Table {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      partitionKey: {
        name: 'PK',
        type: aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: aws_dynamodb.AttributeType.STRING,
      },
      stream: aws_dynamodb.StreamViewType.NEW_IMAGE,
      timeToLiveAttribute: 'TTL',
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.addConventionalGsi('GSI1');
  }

  private addConventionalGsi(indexName: string) {
    this.addGlobalSecondaryIndex({
      indexName,
      partitionKey: {
        name: `${indexName}PK`,
        type: aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: `${indexName}SK`,
        type: aws_dynamodb.AttributeType.STRING,
      },
    });
  }
}
