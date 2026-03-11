import { Router } from 'express';
import { sendMessage, getConversation, getActiveConversations } from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes (must be logged in)
router.post('/', authenticateToken as any, sendMessage);
router.get('/conversations', authenticateToken as any, getActiveConversations);
router.get('/:otherUserId', authenticateToken as any, getConversation);

export default router;
