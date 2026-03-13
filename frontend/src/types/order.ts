// Order types for the bidding-to-transaction flow

export type OrderStatus = 
  | 'pending_payment' 
  | 'paid' 
  | 'awaiting_handover' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export interface Order {
  id: string;
  status: OrderStatus;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  paymentDeadline: string;
  buyerConfirmedAt: string | null;
  sellerConfirmedAt: string | null;
  createdAt: string;
  completedAt: string | null;
  buyerId: string;
  sellerId: string;
  item: {
    id: string;
    title: string;
    imageUrl: string;
    condition: string;
    campus: string;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    isVerified: boolean;
  };
  strikes?: number;
}

export interface ConfirmHandoverRequest {
  role: 'buyer' | 'seller';
}

export interface ReportIssueRequest {
  description: string;
  photos?: string[];
}
