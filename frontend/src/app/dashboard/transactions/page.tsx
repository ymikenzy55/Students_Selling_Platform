'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumb from '@/components/Breadcrumb';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  ExternalLink,
  Shield
} from 'lucide-react';
import Image from 'next/image';

interface Transaction {
  id: string;
  amount: number;
  status: 'HELD_IN_ESCROW' | 'RELEASED_TO_SELLER' | 'REFUNDED' | 'DISPUTED';
  createdAt: string;
  releasedAt?: string;
  listing: {
    id: string;
    title: string;
    imageUrl: string;
  };
  buyer: {
    name: string;
  };
}

export default function TransactionsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  // Mock transactions data
  const MOCK_TRANSACTIONS: Transaction[] = [
    {
      id: 'txn_001',
      amount: 600.00,
      status: 'RELEASED_TO_SELLER',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      releasedAt: new Date(Date.now() - 86400000).toISOString(),
      listing: {
        id: 'listing_103',
        title: 'iPhone 13 Pro - 256GB',
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-c0d0e0c5d7c0?w=500'
      },
      buyer: {
        name: 'Mike Johnson'
      }
    },
    {
      id: 'txn_002',
      amount: 850.00,
      status: 'HELD_IN_ESCROW',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      listing: {
        id: 'listing_101',
        title: 'MacBook Pro M2 - Excellent Condition',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
      },
      buyer: {
        name: 'Sarah Williams'
      }
    },
    {
      id: 'txn_003',
      amount: 55.00,
      status: 'HELD_IN_ESCROW',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      listing: {
        id: 'listing_106',
        title: 'Gaming Mouse - Logitech G502',
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
      },
      buyer: {
        name: 'Alex Brown'
      }
    },
    {
      id: 'txn_004',
      amount: 45.00,
      status: 'DISPUTED',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      listing: {
        id: 'listing_102',
        title: 'Biology 101 Textbook 5th Edition',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
      },
      buyer: {
        name: 'Emma Davis'
      }
    }
  ];

  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'HELD_IN_ESCROW' | 'RELEASED_TO_SELLER' | 'REFUNDED' | 'DISPUTED'>('ALL');

  // Redirect if not authorized
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'SELLER') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading || !user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HELD_IN_ESCROW':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'RELEASED_TO_SELLER':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REFUNDED':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'DISPUTED':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HELD_IN_ESCROW':
        return 'bg-blue-100 text-blue-700';
      case 'RELEASED_TO_SELLER':
        return 'bg-green-100 text-green-700';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-700';
      case 'DISPUTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'HELD_IN_ESCROW':
        return 'In Escrow';
      case 'RELEASED_TO_SELLER':
        return 'Released';
      case 'REFUNDED':
        return 'Refunded';
      case 'DISPUTED':
        return 'Disputed';
      default:
        return status;
    }
  };

  const handleDownloadInvoice = (transactionId: string) => {
    // Mock download - in production, this would generate/download a PDF
    console.log('Downloading invoice for transaction:', transactionId);
    alert('Invoice download would start here');
  };

  const filteredTransactions = filterStatus === 'ALL' 
    ? transactions 
    : transactions.filter(txn => txn.status === filterStatus);

  const stats = {
    total: transactions.length,
    escrow: transactions.filter(t => t.status === 'HELD_IN_ESCROW').length,
    released: transactions.filter(t => t.status === 'RELEASED_TO_SELLER').length,
    disputed: transactions.filter(t => t.status === 'DISPUTED').length,
    totalEarnings: transactions
      .filter(t => t.status === 'RELEASED_TO_SELLER')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingEarnings: transactions
      .filter(t => t.status === 'HELD_IN_ESCROW')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Transactions' }
          ]} 
        />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">Track your sales and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">GH₵{stats.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Escrow</p>
                <p className="text-3xl font-bold text-blue-600">GH₵{stats.pendingEarnings.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.released}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Disputes</p>
                <p className="text-3xl font-bold text-red-600">{stats.disputed}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('HELD_IN_ESCROW')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'HELD_IN_ESCROW'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            In Escrow ({stats.escrow})
          </button>
          <button
            onClick={() => setFilterStatus('RELEASED_TO_SELLER')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'RELEASED_TO_SELLER'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Released ({stats.released})
          </button>
          <button
            onClick={() => setFilterStatus('DISPUTED')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'DISPUTED'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Disputed ({stats.disputed})
          </button>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  {/* Listing Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={transaction.listing.imageUrl}
                      alt={transaction.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {transaction.listing.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Buyer: {transaction.buyer.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                        <p className="text-2xl font-bold text-purple-600">GH₵{transaction.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Transaction Date</p>
                        <p className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</p>
                      </div>
                      {transaction.releasedAt && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Released Date</p>
                          <p className="text-sm text-gray-900">{formatDate(transaction.releasedAt)}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Info */}
                    {transaction.status === 'HELD_IN_ESCROW' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <Shield className="w-4 h-4 inline mr-1" />
                          Payment is held in escrow. Funds will be released once the buyer confirms receipt.
                        </p>
                      </div>
                    )}

                    {transaction.status === 'DISPUTED' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-800">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          This transaction is under dispute. Our support team will review and resolve it.
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/listing/${transaction.listing.id}`)}
                        className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        View Listing
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      
                      {transaction.status === 'RELEASED_TO_SELLER' && (
                        <button
                          onClick={() => handleDownloadInvoice(transaction.id)}
                          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                      )}

                      {transaction.status === 'DISPUTED' && (
                        <button
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Contact Support
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <DollarSign className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filterStatus === 'ALL' ? 'No transactions yet' : `No ${getStatusLabel(filterStatus).toLowerCase()} transactions`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'ALL' 
                ? 'Your sales transactions will appear here'
                : `You don't have any ${getStatusLabel(filterStatus).toLowerCase()} transactions`
              }
            </p>
            <button
              onClick={() => router.push('/dashboard/listings')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer"
            >
              View My Listings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
