import { Router } from 'express';
import { authenticateToken, isAdmin, isSuperAdmin } from '../middleware/auth';
import { 
  setupSuperAdmin,
  createAdmin,
  getAllUsers,
  manuallyVerifyUser,
  deleteListingAdmin,
  fetchAllListingsAdmin,
  fetchDisputedTransactions,
  resolveDispute
} from '../controllers/admin.controller';

const router = Router();

// ==========================================
// PUBLIC SETUP (Ideally disabled after first use)
// ==========================================
router.post('/setup', setupSuperAdmin);

// ==========================================
// SUPER_ADMIN ONLY ROUTES
// ==========================================
router.post('/invite', authenticateToken, isSuperAdmin, createAdmin);

// ==========================================
// ADMIN & SUPER_ADMIN ROUTES
// ==========================================
// User Moderation
router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.put('/users/:id/verify', authenticateToken, isAdmin, manuallyVerifyUser);

// Listing Moderation
router.get('/listings', authenticateToken, isAdmin, fetchAllListingsAdmin);
router.delete('/listings/:id', authenticateToken, isAdmin, deleteListingAdmin);

// Escrow Management
router.get('/transactions/disputes', authenticateToken, isAdmin, fetchDisputedTransactions);
router.put('/transactions/:id/resolve', authenticateToken, isAdmin, resolveDispute);

export default router;
