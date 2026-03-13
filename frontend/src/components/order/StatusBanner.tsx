'use client';

import { OrderStatus } from '@/types/order';
import { CheckCircle2, Clock, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

interface StatusBannerProps {
  status: OrderStatus;
  paymentDeadline?: string;
  onDeadlineExpire?: () => void;
}

export default function StatusBanner({ status, paymentDeadline, onDeadlineExpire }: StatusBannerProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending_payment':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          title: 'Payment Pending',
          description: 'Complete payment to unlock seller contact and proceed',
        };
      case 'paid':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          title: 'Payment Confirmed',
          description: 'Seller contact unlocked - arrange meetup on campus',
        };
      case 'awaiting_handover':
        return {
          icon: AlertCircle,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          title: 'Awaiting Handover Confirmation',
          description: 'Both parties must confirm item exchange',
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          title: 'Transaction Complete!',
          description: 'Thank you for using sBay. Leave a review to help the community',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          title: 'Order Cancelled',
          description: 'Payment deadline expired - order has been cancelled',
        };
      case 'disputed':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-600',
          title: 'Dispute in Progress',
          description: 'Our team is reviewing this case - you will be contacted soon',
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          title: 'Unknown Status',
          description: 'Please contact support',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-4 mb-6`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h3 className={`font-bold text-lg ${config.textColor}`}>{config.title}</h3>
            {status === 'pending_payment' && paymentDeadline && (
              <CountdownTimer deadline={paymentDeadline} onExpire={onDeadlineExpire} />
            )}
          </div>
          <p className={`text-sm ${config.textColor}`}>{config.description}</p>
        </div>
      </div>
    </div>
  );
}
