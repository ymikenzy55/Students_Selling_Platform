import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new transaction (Simulate payment holding in escrow)
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const buyerId = (req as any).user.userId;
    const { listingId, amount } = req.body;

    if (!listingId || !amount) {
      return res.status(400).json({ message: 'Missing listingId or amount' });
    }

    const listing = await prisma.listing.findUnique({ where: { id: String(listingId) } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.isSoldOut) return res.status(400).json({ message: 'Listing is already sold out' });
    if (listing.sellerId === buyerId) return res.status(400).json({ message: 'Cannot buy your own listing' });

    // Mark listing as sold out
    await prisma.listing.update({
        where: { id: String(listingId) },
        data: { isSoldOut: true }
    });

    // Create the transaction held in escrow
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        listingId: String(listingId),
        buyerId,
        status: 'HELD_IN_ESCROW'
      }
    });

    res.status(201).json({ message: 'Payment secured in escrow', transaction });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error processing transaction' });
  }
};

// Release funds to seller (Buyer confirms receipt of item)
export const releaseEscrow = async (req: Request, res: Response) => {
  try {
    const buyerId = (req as any).user.userId;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({ where: { id: String(id) } });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (transaction.buyerId !== buyerId) {
        return res.status(403).json({ message: 'Only the buyer can release the escrow funds' });
    }

    if (transaction.status !== 'HELD_IN_ESCROW') {
        return res.status(400).json({ message: `Cannot release funds. Current status is ${transaction.status}` });
    }

    const updatedTransaction = await prisma.transaction.update({
        where: { id: String(id) },
        data: { status: 'COMPLETED' }
    });

    res.json({ message: 'Funds released to seller successfully', transaction: updatedTransaction });
  } catch (error: any) {
    console.error('Release escrow error:', error);
    res.status(500).json({ message: 'Server error releasing funds' });
  }
};

// Retrieve user's transactions (buying or selling)
export const getUserTransactions = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
  
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            { buyerId: userId },
            { listing: { sellerId: userId } }
          ]
        },
        include: {
          listing: { select: { title: true, price: true, seller: { select: { id: true, name: true } } } },
          buyer: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
  
      res.json(transactions);
    } catch (error: any) {
      console.error('Get transactions error:', error);
      res.status(500).json({ message: 'Server error fetching transactions' });
    }
  };
