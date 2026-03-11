import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Send a message to another user
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.userId;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Missing receiverId or content' });
    }

    if (senderId === receiverId) {
        return res.status(400).json({ message: 'Cannot send a message to yourself' });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: String(receiverId) } });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId: String(receiverId)
      }
    });

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

// Fetch conversation history with a specific user
export const getConversation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: String(otherUserId) },
          { senderId: String(otherUserId), receiverId: userId }
        ]
      },
      orderBy: {
        createdAt: 'asc' // Oldest to newest for chat UI
      }
    });

    res.json(messages);
  } catch (error: any) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error fetching conversation' });
  }
};

// Get a list of users the current user has conversed with recently
export const getActiveConversations = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
  
      // Find all messages where the user is either sender or receiver
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } }
        },
        orderBy: {
            createdAt: 'desc'
        }
      });
  
      // Extract unique conversation partners
      const partnersMap = new Map();
      
      messages.forEach(msg => {
          const partner = msg.senderId === userId ? msg.receiver : msg.sender;
          if (!partnersMap.has(partner.id)) {
              partnersMap.set(partner.id, {
                  partner,
                  lastMessage: msg.content,
                  lastMessageTime: msg.createdAt
              });
          }
      });
  
      const conversations = Array.from(partnersMap.values());
      res.json(conversations);
    } catch (error: any) {
      console.error('Get active conversations error:', error);
      res.status(500).json({ message: 'Server error fetching active conversations' });
    }
  };
