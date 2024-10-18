const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectCache() {
  await client.connect();
}

module.exports = { client, connectCache };
