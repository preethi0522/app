const { connectQueue } = require('./messageQueue');

async function handleMessage(message) {
  const channel = await connectQueue();
  await channel.assertQueue('messages');
  channel.sendToQueue('messages', Buffer.from(JSON.stringify(message)));
}

module.exports = { handleMessage };
