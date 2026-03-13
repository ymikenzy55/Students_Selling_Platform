'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  Send, 
  Search, 
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Trash2,
  Archive,
  Flag,
  UserX,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  listing: {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock conversations
  const MOCK_CONVERSATIONS: Conversation[] = [
    {
      id: 'conv_1',
      otherUser: {
        id: 'user_2',
        name: 'Sarah Williams',
        isOnline: true
      },
      listing: {
        id: 'listing_101',
        title: 'MacBook Pro M2',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        price: 850.00
      },
      lastMessage: {
        text: 'Is it still available?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isRead: false
      },
      unreadCount: 2
    },
    {
      id: 'conv_2',
      otherUser: {
        id: 'user_3',
        name: 'Mike Johnson',
        isOnline: false
      },
      listing: {
        id: 'listing_103',
        title: 'iPhone 13 Pro',
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-c0d0e0c5d7c0?w=500',
        price: 650.00
      },
      lastMessage: {
        text: 'Thanks! I\'ll pick it up tomorrow.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true
      },
      unreadCount: 0
    },
    {
      id: 'conv_3',
      otherUser: {
        id: 'user_4',
        name: 'Alex Brown',
        isOnline: true
      },
      listing: {
        id: 'listing_106',
        title: 'Gaming Mouse',
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        price: 55.00
      },
      lastMessage: {
        text: 'Can you do GH₵50?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: true
      },
      unreadCount: 0
    }
  ];

  const MOCK_MESSAGES: Record<string, Message[]> = {
    conv_1: [
      {
        id: 'msg_1',
        text: 'Hi! I\'m interested in the MacBook.',
        senderId: 'user_2',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_2',
        text: 'Hello! Yes, it\'s still available.',
        senderId: user?.id || 'current_user',
        timestamp: new Date(Date.now() - 480000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_3',
        text: 'Great! What\'s the condition like?',
        senderId: 'user_2',
        timestamp: new Date(Date.now() - 360000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_4',
        text: 'It\'s in excellent condition. Used for one semester only. Small scratch on the bottom but works perfectly.',
        senderId: user?.id || 'current_user',
        timestamp: new Date(Date.now() - 320000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_5',
        text: 'Is it still available?',
        senderId: 'user_2',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isRead: false
      }
    ],
    conv_2: [
      {
        id: 'msg_6',
        text: 'Hi, is the iPhone unlocked?',
        senderId: 'user_3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_7',
        text: 'Yes, it\'s factory unlocked and works with all carriers.',
        senderId: user?.id || 'current_user',
        timestamp: new Date(Date.now() - 7000000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_8',
        text: 'Perfect! I\'ll take it. When can I pick it up?',
        senderId: 'user_3',
        timestamp: new Date(Date.now() - 3700000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_9',
        text: 'Tomorrow afternoon works for me. Main Campus library?',
        senderId: user?.id || 'current_user',
        timestamp: new Date(Date.now() - 3650000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_10',
        text: 'Thanks! I\'ll pick it up tomorrow.',
        senderId: 'user_3',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true
      }
    ],
    conv_3: [
      {
        id: 'msg_11',
        text: 'Interested in the gaming mouse!',
        senderId: 'user_4',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_12',
        text: 'Great! It\'s in excellent condition.',
        senderId: user?.id || 'current_user',
        timestamp: new Date(Date.now() - 10000000).toISOString(),
        isRead: true
      },
      {
        id: 'msg_13',
        text: 'Can you do GH₵50?',
        senderId: 'user_4',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: true
      }
    ]
  };

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES['conv_1']);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-select conversation when coming from order page
  useEffect(() => {
    const openConvData = localStorage.getItem('openConversation');
    if (openConvData) {
      const { userId, userName } = JSON.parse(openConvData);
      localStorage.removeItem('openConversation');
      
      // Find conversation with this user
      const conversation = conversations.find(c => c.otherUser.id === userId || c.otherUser.name === userName);
      if (conversation) {
        setSelectedConversation(conversation);
        setMessages(MOCK_MESSAGES[conversation.id] || []);
      }
    }
  }, [conversations]);
  const [successMessage, setSuccessMessage] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show loading while checking auth
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(MOCK_MESSAGES[conversation.id] || []);
    
    // Mark as read
    setConversations(conversations.map(conv => 
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
        : conv
    ));
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      text: newMessage,
      senderId: user.id,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(conversations.map(conv =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: {
              text: newMessage,
              timestamp: new Date().toISOString(),
              isRead: false
            }
          }
        : conv
    ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleDeleteConversation = () => {
    if (selectedConversation) {
      setConversations(conversations.filter(c => c.id !== selectedConversation.id));
      const remainingConversations = conversations.filter(c => c.id !== selectedConversation.id);
      setSelectedConversation(remainingConversations[0] || null);
      if (remainingConversations[0]) {
        setMessages(MOCK_MESSAGES[remainingConversations[0].id] || []);
      }
      setShowDeleteModal(false);
      setShowMoreMenu(false);
    }
  };

  const handleReportUser = () => {
    if (!reportReason.trim()) {
      return; // Don't submit if no reason selected
    }
    // In production, this would send the report to the backend
    setShowReportModal(false);
    setShowMoreMenu(false);
    setSuccessMessage('User reported successfully. Our team will review your report.');
    setShowSuccessModal(true);
    setReportReason('');
    setReportDetails('');
  };

  const handleBlockUser = () => {
    if (selectedConversation) {
      // In production, this would block the user in the backend
      setConversations(conversations.filter(c => c.id !== selectedConversation.id));
      const remainingConversations = conversations.filter(c => c.id !== selectedConversation.id);
      setSelectedConversation(remainingConversations[0] || null);
      if (remainingConversations[0]) {
        setMessages(MOCK_MESSAGES[remainingConversations[0].id] || []);
      }
      setShowBlockModal(false);
      setShowMoreMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-[calc(100vh-80px)]">
        <div className="mb-3">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Messages</h1>
          <p className="text-sm text-gray-600">
            {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100%-70px)] flex">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full min-h-0">
            {/* Conversations List */}
            <div className="border-r border-gray-200 flex flex-col h-full min-h-0">
              {/* Search */}
              <div className="p-3 border-b border-gray-200 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation, index) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-2.5 border-b border-gray-100 cursor-pointer transition-all ${
                        selectedConversation?.id === conversation.id 
                          ? 'bg-purple-50 border-l-4 border-l-purple-600' 
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {conversation.otherUser.name.charAt(0)}
                            </span>
                          </div>
                          {conversation.otherUser.isOnline && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                              {conversation.otherUser.name}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-purple-600 font-medium truncate mb-0.5">
                            {conversation.listing.title}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs truncate ${
                              conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                            }`}>
                              {conversation.lastMessage.text}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 min-w-[18px] h-4 px-1.5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="md:col-span-2 flex flex-col h-full min-h-0">
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {selectedConversation.otherUser.name.charAt(0)}
                        </span>
                      </div>
                      {selectedConversation.otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">{selectedConversation.otherUser.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.otherUser.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {/* More Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMoreMenu && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMoreMenu(false)}
                        ></div>
                        
                        {/* Menu */}
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                          <button
                            onClick={() => {
                              router.push(`/listing/${selectedConversation.listing.id}`);
                              setShowMoreMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                            View Listing
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowReportModal(true);
                              setShowMoreMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
                          >
                            <Flag className="w-4 h-4" />
                            Report User
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowBlockModal(true);
                              setShowMoreMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
                          >
                            <UserX className="w-4 h-4" />
                            Block User
                          </button>
                          
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          <button
                            onClick={() => {
                              setShowDeleteModal(true);
                              setShowMoreMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Conversation
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Listing Info */}
                <div className="p-2.5 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={selectedConversation.listing.imageUrl}
                        alt={selectedConversation.listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {selectedConversation.listing.title}
                      </p>
                      <p className="text-xs text-purple-600 font-bold">
                        GH₵{selectedConversation.listing.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/listing/${selectedConversation.listing.id}`)}
                      className="px-2.5 py-1.5 text-xs font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user.id;
                    const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {showAvatar ? (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              isCurrentUser ? 'bg-purple-600' : 'bg-gray-300'
                            }`}>
                              <span className="text-white text-xs font-semibold">
                                {isCurrentUser 
                                  ? user.name?.charAt(0) || 'Y'
                                  : selectedConversation.otherUser.name.charAt(0)
                                }
                              </span>
                            </div>
                          ) : (
                            <div className="w-7 h-7"></div>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`px-3 py-2 rounded-2xl ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-tr-sm'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-0.5 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Attach file"
                      >
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Add image"
                      >
                        <ImageIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Add emoji"
                      >
                        <Smile className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="md:col-span-2 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Conversation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Conversation</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this conversation with{' '}
              <span className="font-semibold">{selectedConversation?.otherUser.name}</span>?
              All messages will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConversation}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report User Modal */}
      {showReportModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Report User</h3>
                <p className="text-sm text-gray-500">Help us keep sBay safe</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Report <span className="font-semibold">{selectedConversation?.otherUser.name}</span> for:
            </p>

            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  value="spam"
                  checked={reportReason === 'spam'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-4 h-4 text-purple-600 cursor-pointer"
                />
                <span className="text-gray-700">Spam or misleading</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  value="harassment"
                  checked={reportReason === 'harassment'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-4 h-4 text-purple-600 cursor-pointer"
                />
                <span className="text-gray-700">Harassment or bullying</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  value="scam"
                  checked={reportReason === 'scam'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-4 h-4 text-purple-600 cursor-pointer"
                />
                <span className="text-gray-700">Scam or fraud</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  value="inappropriate"
                  checked={reportReason === 'inappropriate'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-4 h-4 text-purple-600 cursor-pointer"
                />
                <span className="text-gray-700">Inappropriate content</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  value="other"
                  checked={reportReason === 'other'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-4 h-4 text-purple-600 cursor-pointer"
                />
                <span className="text-gray-700">Other</span>
              </label>
            </div>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Additional details (optional)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportDetails('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReportUser}
                className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Block User</h3>
                <p className="text-sm text-gray-500">Prevent further contact</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Block <span className="font-semibold">{selectedConversation?.otherUser.name}</span>?
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Blocked users cannot:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>• Send you messages</li>
                <li>• See your listings</li>
                <li>• Bid on your items</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUser}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
              >
                Block User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Success</h3>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              {successMessage}
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
