import { Router } from 'express';
import { createTransaction, releaseEscrow, getUserTransactions } from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes (must be logged in)
router.post('/', authenticateToken as any, createTransaction);
router.get('/', authenticateToken as any, getUserTransactions);
router.put('/:id/release', authenticateToken as any, releaseEscrow);

export default router;
