const amqp = require('amqplib');

async function connectQueue() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
  }
}

module.exports = { connectQueue };
