import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ----- SYSTEM SETUP -----
// Route designed to establish the very first SuperAdmin account
export const setupSuperAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, secretKey } = req.body;

    // Hardcoded environmental secret to prevent random users from hitting this endpoint
    if (secretKey !== (process.env.SUPER_ADMIN_SECRET || 'init_secret_123')) {
      res.status(403).json({ message: 'Invalid setup secret' });
      return;
    }

    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingAdmin) {
      res.status(400).json({ message: 'A Super Admin already exists on this platform.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || 'System Super Admin',
        role: 'SUPER_ADMIN',
        isVerified: true
      }
    });

    res.status(201).json({ message: 'Super Admin created successfully', user: { id: superAdmin.id, email: superAdmin.email } });
  } catch (error) {
    console.error('Setup Super Admin Error:', error);
    res.status(500).json({ message: 'Failed to setup Super Admin.' });
  }
};

// ----- ADMIN MANAGEMENT -----
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        isVerified: true
      }
    });

    res.status(201).json({ message: 'Admin created successfully', user: { id: admin.id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin.' });
  }
};

// ----- USER MODERATION -----
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true, isVerified: true, 
        ghanaCardNumber: true, ghanaCardImageUrl: true, createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

export const manuallyVerifyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body; // boolean

    const user = await prisma.user.update({
      where: { id: String(id) },
      data: { isVerified },
      select: { id: true, email: true, isVerified: true }
    });
    res.status(200).json({ message: `User verification changed to ${isVerified}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user verification.' });
  }
};

// ----- LISTING MODERATION -----
export const deleteListingAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.listing.delete({ where: { id: String(id) } });
    res.status(200).json({ message: 'Listing permanently deleted by Admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing.' });
  }
};

export const fetchAllListingsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await prisma.listing.findMany({
      include: { seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings.' });
  }
};

// ----- ESCROW DISPUTES -----
export const fetchDisputedTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const disputes = await prisma.transaction.findMany({
      where: { status: 'DISPUTED' }, // Admin only sees disputed ones by default
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        listing: { include: { seller: { select: { id: true, name: true, email: true } } } }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.status(200).json(disputes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disputes.' });
  }
};

export const resolveDispute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { resolution } = req.body; // 'REFUND_BUYER' or 'RELEASE_TO_SELLER'

    if (resolution !== 'REFUND_BUYER' && resolution !== 'RELEASE_TO_SELLER') {
      res.status(400).json({ message: 'Invalid resolution action.' });
      return;
    }

    const tx = await prisma.transaction.update({
      where: { id: String(id) },
      data: { status: resolution as string }
    });

    res.status(200).json({ message: `Dispute resolved: ${resolution}`, transaction: tx });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving dispute.' });
  }
};
