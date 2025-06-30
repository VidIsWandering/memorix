import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import routes from './src/routes/index.js';
import process from 'node:process';
import cron from 'node-cron';
import { notifyAllUsersWithDueFlashcards } from './src/utils/notificationScheduler.js';

config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json());

// Routes
app.use('/api', routes);

// Default route
app.get('/', (_req, res) => {
  res.json({ message: 'Memorix Backend API' });
});

// Error handling
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Mỗi ngày lúc 8h sáng
cron.schedule('* * * * *', async () => {
  console.log('Đang gửi thông báo ôn tập...');
  await notifyAllUsersWithDueFlashcards();
});