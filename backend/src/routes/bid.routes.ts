import { Router } from 'express';
import { placeBid, getUserBids, getSellerBids, updateBidStatus } from '../controllers/bid.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes (must be logged in)
router.post('/', authenticateToken as any, placeBid);
router.get('/user', authenticateToken as any, getUserBids);
router.get('/seller', authenticateToken as any, getSellerBids);
router.put('/:id/status', authenticateToken as any, updateBidStatus);

export default router;
