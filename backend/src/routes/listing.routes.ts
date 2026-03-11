import { Router } from 'express';
import { createListing, getAllListings, getListingById, updateListing, deleteListing } from '../controllers/listing.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes (anyone can view listings)
router.get('/', getAllListings);
router.get('/:id', getListingById);

// Protected routes (must be logged in)
router.post('/', authenticateToken as any, createListing);
router.put('/:id', authenticateToken as any, updateListing);
router.delete('/:id', authenticateToken as any, deleteListing);

export default router;
