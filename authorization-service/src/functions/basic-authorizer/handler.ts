import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _context, callback) => {
  console.log('Event: ', JSON.stringify(event));

  if (event.type !== 'TOKEN') {
    callback('Unauthorized');
  }

  try {
    const [, encodedToken] = event.authorizationToken.split('Basic ');

    console.log(`Encoded token: ${encodedToken}`);

    if (!encodedToken) {
      callback(null, generatePolicy(encodedToken, event.methodArn, 'Deny'));
    }

    const token = Buffer.from(encodedToken, 'base64').toString();
    const [username, password] = token.split(':');

    console.log(`User credentials - ${username}: ${password}`);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';
    const policy = generatePolicy(encodedToken, event.methodArn, effect);

    callback(null, policy);
  } catch (error) {
    callback('Unauthorized: ' + error.message);
  }
};

function generatePolicy(principalId, resource, effect = 'Allow') {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
}
