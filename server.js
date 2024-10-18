const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { handleMessage } = require('./messageHandler');
const { connectDB } = require('./database');
const { connectCache } = require('./cache');
const { authenticateToken } = require('./auth');
const logger = require('./logger');  // Import the logger

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// Connect to MongoDB and Redis
connectDB().then(() => {
  logger.info('Connected to MongoDB');
}).catch((error) => {
  logger.error('Failed to connect to MongoDB', { error });
});

connectCache().then(() => {
  logger.info('Connected to Redis');
}).catch((error) => {
  logger.error('Failed to connect to Redis', { error });
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Authenticate all WebSocket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Implement token verification logic here
  // For example:
  // try {
  //   const user = verifyToken(token);
  //   socket.user = user;
  //   next();
  // } catch (error) {
  //   logger.warn('Failed authentication attempt', { error });
  //   next(new Error('Authentication error'));
  // }
  next();
});

io.on('connection', (socket) => {
  logger.info('New client connected', { id: socket.id });

  socket.on('message', async (message) => {
    logger.info('Received message', { from: socket.id, message });
    try {
      await handleMessage(message);
      logger.info('Message handled successfully', { messageId: message.id });
    } catch (error) {
      logger.error('Error handling message', { error, messageId: message.id });
    }
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { id: socket.id });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).send('An unexpected error occurred');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
