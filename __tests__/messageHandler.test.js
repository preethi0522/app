const { handleMessage } = require('../messageHandler');

// Mock the dependencies
jest.mock('../messageQueue', () => ({
  connectQueue: jest.fn().mockResolvedValue({
    assertQueue: jest.fn(),
    sendToQueue: jest.fn()
  })
}));

describe('handleMessage', () => {
  it('should process a message correctly', async () => {
    const message = { text: 'Hello, world!' };
    await handleMessage(message);

    // Add your assertions here
    // For example:
    // expect(connectQueue).toHaveBeenCalled();
    // expect(channel.sendToQueue).toHaveBeenCalledWith('messages', expect.any(Buffer));
  });
});

const { client: redisClient } = require('./cache');

async function getRecentMessages(userId) {
  const cacheKey = `recent_messages:${userId}`;
  const cachedMessages = await redisClient.get(cacheKey);

  if (cachedMessages) {
    return JSON.parse(cachedMessages);
  }

  // If not in cache, fetch from database
  const messages = await fetchRecentMessagesFromDB(userId);

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(messages), 'EX', 300); // Expire in 5 minutes

  return messages;
}
