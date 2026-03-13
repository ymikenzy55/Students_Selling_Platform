'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  DollarSign, 
  Shield, 
  Users, 
  Package, 
  MessageCircle,
  CheckCircle,
  TrendingUp,
  Heart,
  Search,
  Camera,
  Tag,
  Truck,
  Star,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            About sBay
          </h1>
          <p className="text-lg text-purple-100">
            Your trusted student marketplace
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="md:w-64 flex-shrink-0">
            {/* Mobile: Horizontal Scrollable Nav */}
            <nav className="md:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-xs">Quick Navigation</h3>
              </div>
              <div className="overflow-x-auto">
                <ul className="flex">
                  <li className="border-r border-gray-100 last:border-0">
                    <a 
                      href="#what-is-sbay" 
                      className="block px-4 py-3 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all font-medium whitespace-nowrap"
                    >
                      What is sBay
                    </a>
                  </li>
                  <li className="border-r border-gray-100 last:border-0">
                    <a 
                      href="#buying" 
                      className="block px-4 py-3 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all font-medium whitespace-nowrap"
                    >
                      Buying
                    </a>
                  </li>
                  <li className="border-r border-gray-100 last:border-0">
                    <a 
                      href="#selling" 
                      className="block px-4 py-3 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all font-medium whitespace-nowrap"
                    >
                      Selling
                    </a>
                  </li>
                  <li className="border-r border-gray-100 last:border-0">
                    <a 
                      href="#safety" 
                      className="block px-4 py-3 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all font-medium whitespace-nowrap"
                    >
                      Safety
                    </a>
                  </li>
                  <li className="border-r border-gray-100 last:border-0">
                    <a 
                      href="#community" 
                      className="block px-4 py-3 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all font-medium whitespace-nowrap"
                    >
                      Guidelines
                    </a>
                  </li>
                  <li className="border-r border-gray-100 last:border-0">
                    <a 
                      href="#faqs" 
                      className="block px-4 py-3 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all font-medium whitespace-nowrap"
                    >
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Desktop: Vertical Sticky Nav */}
            <nav className="hidden md:block md:sticky md:top-20 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm">Quick Navigation</h3>
              </div>
              <ul className="py-2">
                <li className="border-b border-gray-100 last:border-0">
                  <a 
                    href="#what-is-sbay" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:border-l-4 hover:border-l-purple-600 transition-all font-medium"
                  >
                    What is sBay
                  </a>
                </li>
                <li className="border-b border-gray-100 last:border-0">
                  <a 
                    href="#buying" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:border-l-4 hover:border-l-purple-600 transition-all font-medium"
                  >
                    Buying on sBay
                  </a>
                </li>
                <li className="border-b border-gray-100 last:border-0">
                  <a 
                    href="#selling" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:border-l-4 hover:border-l-purple-600 transition-all font-medium"
                  >
                    Selling on sBay
                  </a>
                </li>
                <li className="border-b border-gray-100 last:border-0">
                  <a 
                    href="#safety" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:border-l-4 hover:border-l-purple-600 transition-all font-medium"
                  >
                    Safety & Trust
                  </a>
                </li>
                <li className="border-b border-gray-100 last:border-0">
                  <a 
                    href="#community" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:border-l-4 hover:border-l-purple-600 transition-all font-medium"
                  >
                    Community Guidelines
                  </a>
                </li>
                <li className="border-b border-gray-100 last:border-0">
                  <a 
                    href="#faqs" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:border-l-4 hover:border-l-purple-600 transition-all font-medium"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-8">

        {/* What is sBay */}
        <section id="what-is-sbay" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 scroll-mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">What is sBay?</h2>
          <div className="prose max-w-none">
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              sBay is a secure marketplace designed exclusively for university students to buy and sell items within their campus community. Whether you're looking for textbooks, electronics, furniture, or clothing, sBay makes it easy to find great deals from fellow students.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              With built-in escrow payments, identity verification, and campus-specific listings, sBay ensures safe and convenient transactions for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Student Community</h3>
                <p className="text-xs text-gray-600">Buy and sell within your campus</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Secure Payments</h3>
                <p className="text-xs text-gray-600">Escrow protection for all transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Verified Users</h3>
                <p className="text-xs text-gray-600">Ghana Card verification for trust</p>
              </div>
            </div>
          </div>
        </section>

        {/* Buying on sBay */}
        <section id="buying" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Buying on sBay</h2>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-600" />
                  Browse & Search
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Explore listings by category, campus, or use the search bar to find exactly what you need. Filter by price, condition, and more.
                </p>
                <Link href="/browse" className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Start browsing <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  Contact the Seller
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Message the seller to ask questions, negotiate price, or arrange a meetup. Our built-in messaging keeps all communication in one place.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  Place Your Bid
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Submit your offer on the item. The seller will review and either accept, reject, or counter your bid.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  Secure Payment
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Once your bid is accepted, pay securely through our escrow system. Your money is held safely until you confirm receipt of the item.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  5
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600" />
                  Meet & Inspect
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Arrange a safe meetup on campus to inspect the item. Check the condition and ensure it matches the listing description.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Confirm Receipt
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Once you're satisfied with the item, confirm receipt in your dashboard. The payment will be released to the seller, and you can leave a review.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Selling on sBay */}
        <section id="selling" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Selling on sBay</h2>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-green-600" />
                  Create Your Listing
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Take clear photos of your item, write a detailed description, set your price, and choose the category and campus location.
                </p>
                <Link href="/create-listing" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                  Create a listing <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  Respond to Buyers
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Answer questions from interested buyers and review bids. You can accept, reject, or negotiate offers.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Accept a Bid
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  When you receive a fair offer, accept the bid. The buyer will be notified and prompted to make payment through escrow.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  Arrange Meetup
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Coordinate with the buyer to meet on campus. Choose a safe, public location like the library or student center.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Get Paid
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Once the buyer confirms receipt, the payment is released from escrow to your account. You can then withdraw your earnings or use them for purchases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety & Trust */}
        <section id="safety" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Safety & Trust</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">Escrow Protection</h3>
              </div>
              <p className="text-sm text-gray-700">
                All payments are held in escrow until the buyer confirms receipt. This protects both buyers and sellers from fraud.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-bold text-gray-900">Identity Verification</h3>
              </div>
              <p className="text-sm text-gray-700">
                Users verify their identity with Ghana Card to build trust and ensure accountability within the community.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-gray-900">Campus Community</h3>
              </div>
              <p className="text-sm text-gray-700">
                Trade with fellow students from your university. Campus-specific listings make meetups convenient and safe.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-gray-900">Reviews & Ratings</h3>
              </div>
              <p className="text-sm text-gray-700">
                Build your reputation through honest reviews. Check seller ratings before making a purchase.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-bold text-gray-900 mb-2">Safety Tips</h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Always meet in public, well-lit areas on campus</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Inspect items carefully before confirming receipt</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Never share personal financial information outside the platform</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Report suspicious activity or users immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Use the escrow system for all transactions</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Community Guidelines */}
        <section id="community" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 scroll-mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Community Guidelines</h2>
          <div className="prose max-w-none text-sm text-gray-700 space-y-3">
            <p>sBay is built on trust and respect. To keep our community safe and welcoming, please follow these guidelines:</p>
            <ul className="space-y-2">
              <li>Be honest and accurate in your listings</li>
              <li>Communicate respectfully with other users</li>
              <li>Honor your commitments to buy or sell</li>
              <li>Report suspicious activity or policy violations</li>
              <li>Respect intellectual property rights</li>
              <li>Don't sell prohibited items (weapons, drugs, counterfeit goods)</li>
            </ul>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 scroll-mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">How do I get verified?</h3>
              <p className="text-sm text-gray-700">Upload a clear photo of your Ghana Card in your profile settings. Verification typically takes 24-48 hours.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">What payment methods are accepted?</h3>
              <p className="text-sm text-gray-700">We accept mobile money (MTN, Vodafone, AirtelTigo) and bank transfers through our secure escrow system.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">How long does escrow hold my payment?</h3>
              <p className="text-sm text-gray-700">Payments are held until the buyer confirms receipt of the item, typically within 3-7 days of the meetup.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">What if there's a dispute?</h3>
              <p className="text-sm text-gray-700">Contact our support team immediately. We'll mediate the dispute and may issue a refund if the seller violated our policies.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Can I sell to students from other universities?</h3>
              <p className="text-sm text-gray-700">Yes! While listings are campus-specific, you can arrange meetups with students from other universities if both parties agree.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-2">Ready to Get Started?</h2>
          <p className="text-base text-purple-100 mb-4">
            Join thousands of students buying and selling on sBay
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/browse"
              className="px-6 py-2.5 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm"
            >
              Start Shopping
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800 transition-colors border-2 border-white text-sm"
            >
              Sign Up to Sell
            </Link>
          </div>
        </section>

          </main>
        </div>
      </div>
    </div>
  );
}
