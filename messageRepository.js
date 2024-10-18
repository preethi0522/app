const { connectDB } = require('./database');

async function saveMessage(message) {
  const db = await connectDB();
  const result = await db.collection('messages').insertOne(message);
  return result.insertedId;
}

module.exports = { saveMessage };
