'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Order } from '@/types/order';
import Breadcrumb from '@/components/Breadcrumb';
import StatusBanner from '@/components/order/StatusBanner';
import MockPaymentSection from '@/components/order/MockPaymentSection';
import ContactRevealSection from '@/components/order/ContactRevealSection';
import HandoverConfirmation from '@/components/order/HandoverConfirmation';
import CompletionCelebration from '@/components/order/CompletionCelebration';
import ReportIssueModal from '@/components/order/ReportIssueModal';
import OrderSkeleton from '@/components/order/OrderSkeleton';
import { MessageCircle, AlertTriangle, Package } from 'lucide-react';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Determine user role
  const userRole = order && user ? (order.buyerId === user.id ? 'buyer' : 'seller') : null;

  // Fetch order data with polling
  useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      try {
        // Mock API call - replace with real API when backend is ready
        // Determine if current user is buyer or seller based on their role
        const isBuyer = user.role === 'BUYER';
        
        // Map order IDs to corresponding listing data
        let mockOrder: Order;
        
        if (orderId === 'order_bid_2') {
          // iPhone 13 Pro order (accepted bid)
          mockOrder = {
            id: orderId,
            status: 'pending_payment',
            amount: 600.00,
            platformFee: 30.00,
            sellerAmount: 570.00,
            paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            buyerConfirmedAt: null,
            sellerConfirmedAt: null,
            createdAt: new Date().toISOString(),
            completedAt: null,
            buyerId: isBuyer ? user.id : 'other_buyer_id',
            sellerId: isBuyer ? 'other_seller_id' : user.id,
            item: {
              id: 'listing_103',
              title: 'iPhone 13 Pro - 256GB',
              imageUrl: 'https://images.unsplash.com/photo-1592286927505-c0d0e0c5d7c0?w=400',
              condition: 'USED_LIKE_NEW',
              campus: 'Main Campus'
            },
            buyer: {
              id: isBuyer ? user.id : 'other_buyer_id',
              name: isBuyer ? (user.name || 'You') : 'Jane Doe',
              email: isBuyer ? user.email : 'jane@student.edu'
            },
            seller: {
              id: isBuyer ? 'other_seller_id' : user.id,
              name: isBuyer ? 'Mike Johnson' : (user.name || 'You'),
              email: isBuyer ? 'mike@student.edu' : user.email,
              isVerified: true
            }
          };
        } else {
          // Default MacBook order
          mockOrder = {
            id: orderId,
            status: 'pending_payment',
            amount: 850.00,
            platformFee: 42.50,
            sellerAmount: 807.50,
            paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            buyerConfirmedAt: null,
            sellerConfirmedAt: null,
            createdAt: new Date().toISOString(),
            completedAt: null,
            buyerId: isBuyer ? user.id : 'other_buyer_id',
            sellerId: isBuyer ? 'other_seller_id' : user.id,
            item: {
              id: 'listing_101',
              title: 'MacBook Pro M2 - Excellent Condition',
              imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
              condition: 'USED_LIKE_NEW',
              campus: 'North Campus'
            },
            buyer: {
              id: isBuyer ? user.id : 'other_buyer_id',
              name: isBuyer ? (user.name || 'You') : 'Jane Doe',
              email: isBuyer ? user.email : 'jane@student.edu'
            },
            seller: {
              id: isBuyer ? 'other_seller_id' : user.id,
              name: isBuyer ? 'John Smith' : (user.name || 'You'),
              email: isBuyer ? 'john@student.edu' : user.email,
              isVerified: true
            }
          };
        }

        // Only set order if it's not already set, or preserve current status
        setOrder(prev => {
          if (!prev) {
            setIsLoading(false);
            return mockOrder;
          }
          // Preserve the current status and confirmation states
          return {
            ...mockOrder,
            status: prev.status,
            buyerConfirmedAt: prev.buyerConfirmedAt,
            sellerConfirmedAt: prev.sellerConfirmedAt,
            completedAt: prev.completedAt
          };
        });
      } catch (err) {
        setError('Failed to load order details');
        setIsLoading(false);
      }
    };

    fetchOrder();

    // Poll for updates every 8 seconds
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [orderId, user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Show celebration when order completes
  useEffect(() => {
    if (order?.status === 'completed' && !showCelebration) {
      setShowCelebration(true);
    }
  }, [order?.status]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePaymentComplete = async () => {
    console.log('Payment button clicked!');
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Updating order status to paid...');
      setOrder(prev => {
        if (!prev) return null;
        const updated = { ...prev, status: 'paid' as const };
        console.log('Order updated:', updated);
        return updated;
      });
      showToast('Payment successful! Seller contact unlocked.');
    } catch (err) {
      console.error('Payment error:', err);
      showToast('Payment failed. Please try again.');
    }
  };

  const handleConfirmHandover = async () => {
    if (!order || !userRole) return;

    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));

      const now = new Date().toISOString();
      const updatedOrder = { ...order };

      if (userRole === 'buyer') {
        updatedOrder.buyerConfirmedAt = now;
      } else {
        updatedOrder.sellerConfirmedAt = now;
      }

      // Check if both confirmed
      if (updatedOrder.buyerConfirmedAt && updatedOrder.sellerConfirmedAt) {
        updatedOrder.status = 'completed';
        updatedOrder.completedAt = now;
      } else {
        updatedOrder.status = 'awaiting_handover';
      }

      setOrder(updatedOrder);
      showToast('Handover confirmed!');
    } catch (err) {
      showToast('Failed to confirm. Please try again.');
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast('Review submitted successfully!');
      setShowCelebration(false);
    } catch (err) {
      showToast('Failed to submit review.');
    }
  };

  const handleReportIssue = async (description: string, photos: string[]) => {
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrder(prev => prev ? { ...prev, status: 'disputed' } : null);
      setShowReportModal(false);
      showToast('Issue reported. Our team will review it shortly.');
    } catch (err) {
      showToast('Failed to submit report.');
    }
  };

  const handleDeadlineExpire = () => {
    setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
    showToast('Order cancelled due to payment timeout.');
  };

  if (isLoading || authLoading) {
    return <OrderSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This order does not exist.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Orders', href: '/dashboard/transactions' },
            { label: `Order #${orderId.slice(0, 8)}` }
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Details</h1>
          <p className="text-gray-600">
            {userRole === 'buyer' ? 'Track your purchase' : 'Manage your sale'}
          </p>
        </div>

        <StatusBanner
          status={order.status}
          paymentDeadline={order.paymentDeadline}
          onDeadlineExpire={handleDeadlineExpire}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Item Details</h2>
              </div>
              <div className="flex gap-4">
                <img
                  src={order.item.imageUrl}
                  alt={order.item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{order.item.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {order.item.condition}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                      {order.item.campus}
                    </span>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    GH₵ {order.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {order.status === 'pending_payment' && userRole === 'buyer' && (
              <MockPaymentSection
                amount={order.amount}
                platformFee={order.platformFee}
                onPaymentComplete={handlePaymentComplete}
              />
            )}

            {/* Contact Section */}
            {(order.status === 'paid' || order.status === 'awaiting_handover' || order.status === 'completed') && userRole === 'buyer' && (
              <ContactRevealSection
                isLocked={false}
                sellerName={order.seller.name}
                sellerId={order.seller.id}
                isVerified={order.seller.isVerified}
              />
            )}

            {order.status === 'pending_payment' && userRole === 'buyer' && (
              <ContactRevealSection
                isLocked={true}
                sellerName={order.seller.name}
                sellerId={order.seller.id}
                isVerified={order.seller.isVerified}
              />
            )}

            {/* Handover Confirmation */}
            {(order.status === 'paid' || order.status === 'awaiting_handover') && (
              <HandoverConfirmation
                userRole={userRole!}
                buyerConfirmedAt={order.buyerConfirmedAt}
                sellerConfirmedAt={order.sellerConfirmedAt}
                onConfirm={handleConfirmHandover}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-semibold text-gray-900">#{orderId.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {userRole === 'buyer' ? 'Seller' : 'Buyer'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {userRole === 'buyer' ? order.seller.name : order.buyer.name}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Item Price</span>
                    <span className="font-semibold text-gray-900">GH₵ {order.amount.toFixed(2)}</span>
                  </div>
                  {userRole === 'buyer' && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-semibold text-gray-900">GH₵ {order.platformFee.toFixed(2)}</span>
                    </div>
                  )}
                  {userRole === 'seller' && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Platform Fee (5%)</span>
                      <span className="font-semibold text-red-600">-GH₵ {order.platformFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900">
                      {userRole === 'buyer' ? 'Total Paid' : 'You Receive'}
                    </span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      GH₵ {userRole === 'buyer' ? (order.amount + order.platformFee).toFixed(2) : order.sellerAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/messages')}
                  className="w-full px-4 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-purple-300 transition-all font-medium cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message {userRole === 'buyer' ? 'Seller' : 'Buyer'}
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full px-4 py-3 bg-white text-red-600 rounded-lg border-2 border-red-300 hover:border-red-400 transition-all font-medium cursor-pointer flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCelebration && (
        <CompletionCelebration
          sellerName={order.seller.name}
          itemTitle={order.item.title}
          onReviewSubmit={handleReviewSubmit}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {showReportModal && (
        <ReportIssueModal
          orderId={orderId}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportIssue}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom duration-300 z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
