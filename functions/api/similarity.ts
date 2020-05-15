import { Handler, Context, APIGatewayEvent } from 'aws-lambda';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { SimilarityRecord, UserRecord } from '../interface/kintone.interface';
import { Response } from '../interface/common.interface';

// 最大取得件数の最大値
const DEFAULT_FETCH_MAX = 100;

interface SimilarityWithUserName {
  id: string;
  lineDisplayName: string;
  linePictureUrl: string;
  className: string;
  score: string;
  imageUrl: string;
}

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<Response> => {
  console.log(`event=${JSON.stringify(event)}`);
  console.log(`context=${JSON.stringify(context)}`);
  let response: Response;
  if (event.httpMethod === 'GET') {
    let max = DEFAULT_FETCH_MAX;
    const queryParameters = event.queryStringParameters;
    if (
      queryParameters &&
      Object.prototype.hasOwnProperty.call(queryParameters, 'max') &&
      Number.isInteger(Number(queryParameters.max))
    ) {
      max = Number(queryParameters.max);
    }
    const classifiedAppClient = createClassifiedAppClient();
    const classifiedAppResponse = await classifiedAppClient.record.getRecords<
      SimilarityRecord
    >({
      app: process.env.KINTONE_CLASSIFIED_APP_ID || ''
    });

    // スコアで降順ソート
    const sortedSimilarityRecords = [
      ...classifiedAppResponse.records
    ].sort((a, b) => (Number(a.score.value) < Number(b.score.value) ? 1 : -1));

    // 最大取得件数でフィルタ
    const filteredSimilarityRecords = sortedSimilarityRecords.slice(0, max);
    console.log(
      `filteredSimilarityRecords=${JSON.stringify(filteredSimilarityRecords)}`
    );

    const userAppClient = createUserAppClient();
    const userAppResponse = await userAppClient.record.getRecords<UserRecord>({
      app: process.env.KINTONE_USER_APP_ID || ''
    });
    console.log(`userAppResponse=${JSON.stringify(userAppResponse)}`);

    const similairtyWithUserNames: SimilarityWithUserName[] = filteredSimilarityRecords.map(
      (similarityRecord) => {
        const matchedUser = userAppResponse.records.find(
          (userRecord) =>
            userRecord.line_user_id.value ===
            similarityRecord.line_user_id.value
        );
        const withUserName: SimilarityWithUserName = {
          id: similarityRecord.$id.value,
          lineDisplayName: matchedUser
            ? matchedUser.line_display_name.value
            : '',
          linePictureUrl: matchedUser ? matchedUser.line_picture_url.value : '',
          className: similarityRecord.class_name.value,
          score: similarityRecord.score.value,
          imageUrl: similarityRecord.image_url.value
        };
        return withUserName;
      }
    );

    response = {
      statusCode: 200,
      body: JSON.stringify(similairtyWithUserNames)
    };
  } else {
    response = {
      statusCode: 400,
      body: JSON.stringify({ errorMessage: 'Bad Request' })
    };
  }

  return response;
};

function createClassifiedAppClient(): KintoneRestAPIClient {
  const client = new KintoneRestAPIClient({
    baseUrl: process.env.KINTONE_BASE_URL || '',
    auth: {
      apiToken: process.env.KINTONE_CLASSIFIED_APP_API_TOKEN || ''
    }
  });
  return client;
}

function createUserAppClient(): KintoneRestAPIClient {
  const client = new KintoneRestAPIClient({
    baseUrl: process.env.KINTONE_BASE_URL || '',
    auth: {
      apiToken: process.env.KINTONE_USER_APP_API_TOKEN || ''
    }
  });
  return client;
}
