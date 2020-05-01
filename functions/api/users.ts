import { Handler, Context, APIGatewayEvent } from 'aws-lambda'
import { KintoneRestAPIClient } from '@kintone/rest-api-client'

interface Response {
  statusCode: number
  body: string
}

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  console.log(`event=${JSON.stringify(event)}`)
  console.log(`context=${JSON.stringify(context)}`)
  let response: Response
  if (event.httpMethod === 'GET') {
    const kintoneClient = createUserAppClient()
    const result = await kintoneClient.record.getRecords({
      app: process.env.KINTONE_USER_APP_ID || ''
    })
    response = {
      statusCode: 200,
      body: JSON.stringify(result.records)
    }
  } else {
    response = {
      statusCode: 400,
      body: JSON.stringify({
        msg: 'Bad Request'
      })
    }
  }

  return response
}

function createUserAppClient(): KintoneRestAPIClient {
  const client = new KintoneRestAPIClient({
    baseUrl: process.env.KINTONE_BASE_URL || '',
    auth: {
      apiToken: process.env.KINTONE_USER_APP_API_TOKEN || ''
    }
  })
  return client
}
