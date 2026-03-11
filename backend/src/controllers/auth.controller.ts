import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import Tesseract from 'tesseract.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = '7d';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, ghanaCardNumber } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'BUYER',
        ghanaCardNumber,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, isVerified: true, createdAt: true }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};


export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { name, ghanaCardNumber, ghanaCardImageUrl } = req.body;

    const data: any = {};
    if (name) data.name = name;
    
    // Allow either the number, or an image upload of the card
    if (ghanaCardNumber || ghanaCardImageUrl) {
      if (ghanaCardNumber) data.ghanaCardNumber = ghanaCardNumber;
      if (ghanaCardImageUrl) data.ghanaCardImageUrl = ghanaCardImageUrl;
      
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const currentName = name || user?.name || '';
      
      // If an image was provided, run OCR to verify the name matches!
      if (ghanaCardImageUrl) {
          console.log(`Running OCR verification for ${currentName}...`);
          try {
              // Run tesseract against the image URL provided (in production this would be an S3 URL)
              const { data: { text } } = await Tesseract.recognize(ghanaCardImageUrl, 'eng');
              console.log('OCR Extracted Text:', text);
              
              const extractedText = text.toUpperCase();
              
              // 1. Basic check: ensure it's a Ghana Card
              if (!extractedText.includes('GHANA') && !extractedText.includes('NATIONAL ID')) {
                  res.status(400).json({ message: 'The uploaded image does not appear to be a valid Ghana Card.' });
                  return;
              }
              
              // 2. Advanced check: Verify their registered First/Last name appears on the card
              const nameParts = currentName.toUpperCase().split(' ');
              const hasMatchingName = nameParts.some((part: string) => part.length > 2 && extractedText.includes(part));
              
              if (!hasMatchingName) {
                  res.status(400).json({ message: `Verification failed. The name on the card does not match your registered name: ${currentName}` });
                  return;
              }
              
              console.log(`OCR Verification Successful for ${currentName}!`);
              data.isVerified = true; 
          } catch (ocrError) {
              console.error('OCR Processing Error:', ocrError);
              res.status(500).json({ message: 'Failed to process the ID image. Please try again with a clearer photo.' });
              return;
          }
      } else {
        // Fallback for manual number entry (if allowed by business logic)
        data.isVerified = true; 
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, isVerified: true, ghanaCardImageUrl: true, createdAt: true }
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};
