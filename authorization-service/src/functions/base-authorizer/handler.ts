import {generatePolicy} from "../../utils";

const basicAuthorizer = (event, ctx, cb) => {
    console.log('Event: ', JSON.stringify(event));

    if(event.type !== 'TOKEN') {
        cb('Unauthorized');
    }

    try {
        const {authorizationToken, methodArn: resource} = event;
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const creds = buff.toString('utf-8').split(':');
        const [username, password] = creds;

        console.log('Provided creds: ', username, password);

        const storedUserPass = process.env[username];
        const effect = !storedUserPass || storedUserPass !== password ? 'Deny': 'Allow';

        const policy = generatePolicy(encodedCreds, resource, effect);
        console.log('Generated policy', policy);

        cb(null, policy);
    } catch (e) {
        console.log('Error', e);
        cb('Unauthorized: ' + e.message);
    }

}

export default basicAuthorizer;