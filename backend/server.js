import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import routes from './src/routes/index.js';
import process from 'node:process';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { notifyAllUsersWithDueFlashcards } from './src/utils/notificationScheduler.js';

config();

// fix cho __dirname nếu dùng ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Upload images 
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json({ limit: '10mb' })); // hoặc cao hơn nếu cần
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', routes);

// Cron job for daily notifications
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily notification job...');
  try {
    await notifyAllUsersWithDueFlashcards();
    console.log('Daily notifications sent successfully!');
  } catch (error) {
    console.error('Error sending daily notifications:', error);
  }
});

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

