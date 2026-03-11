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
  resolveDispute,
  getUsersByRole,
  getUserDetails,
  suspendUser,
  getAllReports,
  updateReportStatus,
  getAllReviews,
  updateReviewStatus,
  getDashboardStats,
} from '../controllers/admin.controller';

const router = Router();

// PUBLIC SETUP (disable after first use in production)
router.post('/setup', setupSuperAdmin);

// SUPER_ADMIN ONLY
router.post('/invite', authenticateToken, isSuperAdmin, createAdmin);

// ADMIN & SUPER_ADMIN
router.get('/stats', authenticateToken, isAdmin, getDashboardStats);

// User Moderation — role filter MUST come before :id to avoid route conflicts
router.get('/users/role/:role', authenticateToken, isAdmin, getUsersByRole);
router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.get('/users/:id', authenticateToken, isAdmin, getUserDetails);
router.put('/users/:id/verify', authenticateToken, isAdmin, manuallyVerifyUser);
router.put('/users/:id/suspend', authenticateToken, isAdmin, suspendUser);

// Listing Moderation
router.get('/listings', authenticateToken, isAdmin, fetchAllListingsAdmin);
router.delete('/listings/:id', authenticateToken, isAdmin, deleteListingAdmin);

// Escrow Management
router.get('/transactions/disputes', authenticateToken, isAdmin, fetchDisputedTransactions);
router.put('/transactions/:id/resolve', authenticateToken, isAdmin, resolveDispute);

// Reports
router.get('/reports', authenticateToken, isAdmin, getAllReports);
router.put('/reports/:id/status', authenticateToken, isAdmin, updateReportStatus);

// Reviews
router.get('/reviews', authenticateToken, isAdmin, getAllReviews);
router.put('/reviews/:id/status', authenticateToken, isAdmin, updateReviewStatus);

export default router;
