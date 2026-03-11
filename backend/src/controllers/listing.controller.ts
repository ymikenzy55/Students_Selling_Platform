import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new listing (Protected Route)
export const createListing = async (req: Request, res: Response) => {
  try {
    const { title, description, price, condition, category, campus, imageUrl } = req.body;
    
    // The user object is injected by the auth middleware
    const userId = (req as any).user.userId;

    if (!title || !description || !price || !condition || !category || !campus) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        condition,
        category,
        campus,
        imageUrl,
        sellerId: userId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            isVerified: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error: any) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error creating listing' });
  }
};

// Get all active listings
export const getAllListings = async (req: Request, res: Response) => {
  try {
    // Optional query filters
    const { category, campus, search } = req.query;

    let whereClause: Prisma.ListingWhereInput = {
      isSoldOut: false // Only show active items
    };

    if (typeof category === 'string') whereClause.category = category;
    if (typeof campus === 'string') whereClause.campus = campus;
    
    if (typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            isVerified: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(listings);
  } catch (error: any) {
    console.error('Get all listings error:', error);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
};

// Get single listing by id
export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id: String(id) },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            role: true
          }
        },
        bids: {
          include: {
            buyer: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error: any) {
    console.error('Get single listing error:', error);
    res.status(500).json({ message: 'Server error fetching listing' });
  }
};

// Update a listing (Protected)
export const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { title, description, price, condition, category, campus, imageUrl, isSoldOut } = req.body;

    const existingListing = await prisma.listing.findUnique({ where: { id: String(id) } });

    if (!existingListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (existingListing.sellerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (condition) updateData.condition = condition;
    if (category) updateData.category = category;
    if (campus) updateData.campus = campus;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isSoldOut !== undefined) updateData.isSoldOut = isSoldOut;

    const updatedListing = await prisma.listing.update({
      where: { id: String(id) },
      data: updateData
    });

    res.json({ message: 'Listing updated successfully', listing: updatedListing });
  } catch (error: any) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error updating listing' });
  }
};

// Delete a listing (Protected)
export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const existingListing = await prisma.listing.findUnique({ where: { id: String(id) } });

    if (!existingListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (existingListing.sellerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await prisma.listing.delete({ where: { id: String(id) } });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error deleting listing' });
  }
};
