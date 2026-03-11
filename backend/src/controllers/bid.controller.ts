import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Place a bid on a listing
export const placeBid = async (req: Request, res: Response) => {
  try {
    const { listingId, amount } = req.body;
    const buyerId = (req as any).user.userId;

    if (!listingId || !amount) {
      return res.status(400).json({ message: 'Missing listingId or amount' });
    }

    const listing = await prisma.listing.findUnique({ where: { id: String(listingId) } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    
    // Prevent seller from bidding on their own item
    if (listing.sellerId === buyerId) {
       return res.status(400).json({ message: 'Cannot bid on your own listing' });
    }

    const bid = await prisma.bid.create({
      data: {
        amount: parseFloat(amount),
        listingId: String(listingId),
        buyerId
      }
    });

    res.status(201).json({ message: 'Bid placed successfully', bid });
  } catch (error: any) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error placing bid' });
  }
};

// Get all bids placed by the logged-in user
export const getUserBids = async (req: Request, res: Response) => {
  try {
    const buyerId = (req as any).user.userId;

    const bids = await prisma.bid.findMany({
      where: { buyerId },
      include: {
        listing: {
          select: { 
            title: true, 
            price: true, 
            imageUrl: true,
            seller: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bids);
  } catch (error: any) {
    console.error('Get user bids error:', error);
    res.status(500).json({ message: 'Server error fetching bids' });
  }
};

// Get all bids placed on the seller's listings (for Sellers)
export const getSellerBids = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.userId;

    const bids = await prisma.bid.findMany({
      where: {
        listing: { sellerId } // Find bids where the listing belongs to this seller
      },
      include: {
        listing: { select: { title: true, price: true } },
        buyer: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bids);
  } catch (error: any) {
    console.error('Get seller bids error:', error);
    res.status(500).json({ message: 'Server error fetching seller bids' });
  }
};

// Seller accepts or rejects a bid
export const updateBidStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'
    const sellerId = (req as any).user.userId;

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be ACCEPTED or REJECTED' });
    }

    const bid = await prisma.bid.findUnique({
      where: { id: String(id) },
      include: { listing: true }
    });

    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    // Verify the person updating is the seller of the listing
    if (bid.listing.sellerId !== sellerId) {
      return res.status(403).json({ message: 'Not authorized to update this bid' });
    }

    const updatedBid = await prisma.bid.update({
      where: { id: String(id) },
      data: { status }
    });

    res.json({ message: `Bid ${status.toLowerCase()} successfully`, bid: updatedBid });
  } catch (error: any) {
    console.error('Update bid status error:', error);
    res.status(500).json({ message: 'Server error updating bid status' });
  }
};
