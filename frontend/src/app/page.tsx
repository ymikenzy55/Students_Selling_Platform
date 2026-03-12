'use client';

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Header from "@/components/Header";
import { ShoppingBag, Shield, Zap, Users, Package, Search, MessageSquare, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[500px]">
            {/* Left Content */}
            <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <div className="inline-block mb-3 px-4 py-2 bg-purple-100 rounded-full">
                  <span className="text-sm font-semibold text-purple-700">🎓 Bid Smart • Buy Easy • Sell Fast</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-5xl">
                  <span className="block mb-2">Your campus</span>
                  <span className="block mb-2">marketplace for</span>
                  <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    smart deals
                  </span>
                </h1>
                <p className="mt-4 text-base text-gray-600 leading-relaxed">
                  Place bids, buy instantly, or list items in seconds. From textbooks to electronics, trade safely with verified students on your campus.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/browse"
                    className="px-6 py-3 text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] text-center"
                  >
                    Browse Listings
                  </Link>
                  {user ? (
                    <Link
                      href="/create-listing"
                      className="px-6 py-3 text-sm font-bold rounded-2xl text-purple-600 bg-white border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-md hover:shadow-lg text-center"
                    >
                      Start Selling
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="px-6 py-3 text-sm font-bold rounded-2xl text-purple-600 bg-white border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-md hover:shadow-lg text-center"
                    >
                      Sign Up Free
                    </Link>
                  )}
                </div>
                
                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-600">Active Listings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">1K+</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-xs text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image - Bubble Shape */}
            <div className="relative h-full min-h-[500px]">
              
              {/* ACTIVE: Bubble Shape - Organic rounded blob */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center p-6">
                <div 
                  className="w-full h-full overflow-hidden"
                  style={{
                    borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%'
                  }}
                >
                  <img src="/logo.jpg" alt="Satisfied buyer and seller" className="w-full h-full object-cover object-center" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Easy Trading */}
            <div className="group h-64 perspective-1000">
              <div className="relative h-full w-full transition-all duration-500 preserve-3d group-hover:rotate-y-180">
                {/* Front */}
                <div className="absolute inset-0 bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center backface-hidden flex flex-col justify-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Trading</h3>
                  <p className="text-sm text-gray-600">List items in seconds and connect with buyers instantly</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 p-6 rounded-xl shadow-lg text-white rotate-y-180 backface-hidden flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-3">Quick & Simple</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li>• Snap a photo of your item</li>
                    <li>• Add title, price & details</li>
                    <li>• Publish in under 60 seconds</li>
                    <li>• Get instant notifications</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Secure Payments */}
            <div className="group h-64 perspective-1000">
              <div className="relative h-full w-full transition-all duration-500 preserve-3d group-hover:rotate-y-180">
                {/* Front */}
                <div className="absolute inset-0 bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center backface-hidden flex flex-col justify-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
                  <p className="text-sm text-gray-600">Escrow system protects both buyers and sellers</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 p-6 rounded-xl shadow-lg text-white rotate-y-180 backface-hidden flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-3">Protected Transactions</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li>• Funds held in secure escrow</li>
                    <li>• Released after confirmation</li>
                    <li>• Dispute resolution support</li>
                    <li>• Full refund protection</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fast Deals */}
            <div className="group h-64 perspective-1000">
              <div className="relative h-full w-full transition-all duration-500 preserve-3d group-hover:rotate-y-180">
                {/* Front */}
                <div className="absolute inset-0 bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center backface-hidden flex flex-col justify-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Deals</h3>
                  <p className="text-sm text-gray-600">Bid on items and close deals quickly with messaging</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 p-6 rounded-xl shadow-lg text-white rotate-y-180 backface-hidden flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-3">Quick Negotiations</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li>• Place bids on any listing</li>
                    <li>• Real-time chat with sellers</li>
                    <li>• Accept offers instantly</li>
                    <li>• Close deals in minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Campus Community */}
            <div className="group h-64 perspective-1000">
              <div className="relative h-full w-full transition-all duration-500 preserve-3d group-hover:rotate-y-180">
                {/* Front */}
                <div className="absolute inset-0 bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center backface-hidden flex flex-col justify-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Campus Community</h3>
                  <p className="text-sm text-gray-600">Trade with verified students from your university</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 p-6 rounded-xl shadow-lg text-white rotate-y-180 backface-hidden flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-3">Verified Students</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li>• Student ID verification</li>
                    <li>• Campus-specific listings</li>
                    <li>• Meet on campus safely</li>
                    <li>• Build trusted connections</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 overflow-hidden" style={{
        background: 'radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(217, 70, 239, 0.3) 0px, transparent 50%)',
        backgroundColor: '#fafafa'
      }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to start buying or selling on campus</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'seller'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I AM A SELLER
              </button>
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'buyer'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I AM A BUYER
              </button>
            </div>
          </div>

          {/* Seller Steps */}
          {activeTab === 'seller' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-48 relative">
                  <img src="/list.jpg" alt="List your items" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">LIST IT</h3>
                  <p className="text-gray-600 text-sm">
                    Take a quick photo, set your price, and publish your listing. Your item goes live instantly and reaches verified students on campus.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-48 relative">
                  <img src="/share.jpg" alt="Share your listings" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">SHARE IT</h3>
                  <p className="text-gray-600 text-sm">
                    Share listings with your followers and use daily themed hashtags to reach more buyers on campus.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-48 relative">
                  <img src="/earn.jpg" alt="Earn cash" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">EARN CASH</h3>
                  <p className="text-gray-600 text-sm">
                    Shipping is easy with our prepaid labels, and funds are released to you once the buyer confirms receipt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buyer Steps */}
          {activeTab === 'buyer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Search className="w-20 h-20 text-purple-600" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">BROWSE</h3>
                  <p className="text-gray-600 text-sm">
                    Discover unique items from verified students on your campus. Filter by category, price, and condition.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <MessageSquare className="w-20 h-20 text-purple-600" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">BID OR BUY</h3>
                  <p className="text-gray-600 text-sm">
                    Place a bid to negotiate or buy instantly at the listed price. Chat with sellers to ask questions.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Shield className="w-20 h-20 text-purple-600" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">SECURE PAYMENT</h3>
                  <p className="text-gray-600 text-sm">
                    Your payment is held in escrow until you confirm receipt. Full refund protection if something goes wrong.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-white py-16 relative overflow-hidden">
        {/* Background decorative SVG */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <img src="/add-design.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10">
          <img src="/add-design.svg" alt="" className="w-full h-full transform rotate-180" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Discover the sBay Community
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                sBay connects you to fellow students and closets filled with unique styles, hard-to-find pieces, and endless items to discover. Get started today and join our vibrant & diverse community who make shopping and selling simple, social, and sustainable!
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                <img 
                  src="/logo.jpg" 
                  alt="sBay Community" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-200 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest deals, campus trends, and exclusive offers delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-300 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 shadow-sm"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top Section with CTA */}
          <div className="text-center mb-12 pb-12 border-b border-gray-700">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Trading?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students buying and selling on campus. List your first item today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/browse"
                className="px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Browse Listings
              </Link>
              <Link
                href="/create-listing"
                className="px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-white hover:bg-white hover:text-purple-600 transition-all"
              >
                Start Selling
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <img src="/favi-sbay.png" alt="sBay Logo" className="w-28 h-auto object-contain rounded-2xl" />
              </div>
              <p className="text-sm text-gray-400 mb-4 max-w-[200px]">
                Your campus marketplace for smart deals.
              </p>
              {/* Social Icons Placeholder */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="text-sm">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="text-sm">in</span>
                </a>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h4 className="font-semibold mb-4 text-purple-300">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse All</Link></li>
                <li><Link href="/browse?category=electronics" className="text-gray-400 hover:text-white transition-colors">Electronics</Link></li>
                <li><Link href="/browse?category=books" className="text-gray-400 hover:text-white transition-colors">Books</Link></li>
                <li><Link href="/browse?category=furniture" className="text-gray-400 hover:text-white transition-colors">Furniture</Link></li>
                <li><Link href="/browse?category=clothing" className="text-gray-400 hover:text-white transition-colors">Clothing</Link></li>
              </ul>
            </div>

            {/* Sell Column */}
            <div>
              <h4 className="font-semibold mb-4 text-purple-300">Sell</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/create-listing" className="text-gray-400 hover:text-white transition-colors">Create Listing</Link></li>
                <li><Link href="/dashboard/listings" className="text-gray-400 hover:text-white transition-colors">My Listings</Link></li>
                <li><Link href="/dashboard/transactions" className="text-gray-400 hover:text-white transition-colors">Transactions</Link></li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h4 className="font-semibold mb-4 text-purple-300">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety Tips</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2026 sBay. Made with 💜 for students.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
