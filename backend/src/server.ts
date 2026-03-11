import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import listingRoutes from './routes/listing.routes';
import bidRoutes from './routes/bid.routes';
import messageRoutes from './routes/message.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Student Marketplace API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
