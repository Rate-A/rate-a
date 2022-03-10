import AWS from 'aws-sdk';
import { ENV_CAT_GIRL_TABLE } from '../constants';
import {
  CatGirl,
  CatGirlVote,
  CatGirlVoteValue,
  getNowTimestamp,
} from './cat-girl-service';
import { Logger } from './logger';

export class CatGirlPersistence {
  private readonly tableName: string;
  private readonly documentClient: AWS.DynamoDB.DocumentClient;

  /**
   * How long a cat girl will stick around if neglected.
   */
  private readonly newCatGirlPatience = 300;

  constructor() {
    this.tableName = <string>process.env[ENV_CAT_GIRL_TABLE];
    this.documentClient = new AWS.DynamoDB.DocumentClient();
  }

  async createCatGirl(nakedCatGirl: CatGirl) {
    Logger.info('Persisting CatGirl', { catGirlId: nakedCatGirl.catGirlId });
    Logger.debug('CatGirl inspection', { nakedCatGirl });

    await this.documentClient
      .put({
        TableName: this.tableName,
        Item: this.objectifyCatGirl(nakedCatGirl),
        // Prevents trampling over another cat girl.
        ConditionExpression: 'attribute_not_exists(PK)',
      })
      .promise();

    return nakedCatGirl;
  }

  async getCatGirl(catGirlId: string): Promise<CatGirl | undefined> {
    Logger.info('Getting CatGirl', { catGirlId });

    const getResult = await this.documentClient
      .get({
        TableName: this.tableName,
        Key: {
          PK: `CatGirl#${catGirlId}`,
          SK: 'CatGirl',
        },
      })
      .promise();

    Logger.info('CatGirl getResult', { getResult });

    return getResult.Item ? this.deobjectifyCatGirl(getResult.Item) : undefined;
  }

  async vote(catGirlVote: CatGirlVote): Promise<CatGirl | undefined> {
    Logger.info('Voting for CatGirl', { catGirlVote });

    function column() {
      switch (catGirlVote.vote) {
        case CatGirlVoteValue.HOT:
          return 'hotCount';
        case CatGirlVoteValue.HORNY_JAIL:
          return 'hornyJailCount';
        case CatGirlVoteValue.NOT_HOT:
          return 'notHotCount';
        default:
          throw new Error(`Unknown vote type ${catGirlVote.vote}`);
      }
    }

    // TODO: Batch these updates so no CatGirls get too stressed.
    const updateRes = await this.documentClient
      .update({
        TableName: this.tableName,
        Key: {
          PK: `CatGirl#${catGirlVote.catGirlId}`,
          SK: 'CatGirl',
        },
        UpdateExpression:
          'SET #CounterColumn = #CounterColumn + :Increment REMOVE #TTL',
        ExpressionAttributeNames: {
          '#CounterColumn': column(),
          '#TTL': 'TTL',
        },
        ExpressionAttributeValues: {
          ':Increment': 1,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    Logger.debug('Update result', { updateRes });

    return updateRes.Attributes
      ? this.deobjectifyCatGirl(updateRes.Attributes)
      : undefined;
  }

  private objectifyCatGirl(
    catGirl: CatGirl
  ): AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap {
    const shouldHaveTtl =
      catGirl.hotCount + catGirl.notHotCount + catGirl.hornyJailCount;

    return {
      PK: `CatGirl#${catGirl.catGirlId}`,
      SK: 'CatGirl',
      catGirlId: catGirl.catGirlId,
      hotCount: catGirl.hotCount,
      notHotCount: catGirl.notHotCount,
      hornyJailCount: catGirl.hornyJailCount,
      TTL: shouldHaveTtl
        ? getNowTimestamp() + this.newCatGirlPatience
        : undefined,
    };
  }

  private deobjectifyCatGirl(
    item: AWS.DynamoDB.DocumentClient.AttributeMap
  ): CatGirl {
    return {
      catGirlId: item['catGirlId'],
      hornyJailCount: item['hornyJailCount'],
      hotCount: item['hotCount'],
      notHotCount: item['notHotCount'],
      version: item['version'],
    };
  }
}
