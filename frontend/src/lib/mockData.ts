// Mock data for frontend development
// TODO: Replace with real API calls when backend is ready

export const MOCK_LISTINGS = [
  {
    id: "listing_101",
    title: "MacBook Pro M2 - Excellent Condition",
    description: "Used for one semester. Small scratch on the bottom. Comes with charger.",
    price: 850.00,
    condition: "USED_LIKE_NEW",
    category: "ELECTRONICS",
    campus: "North Campus",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    isSoldOut: false,
    createdAt: "2023-10-25T14:30:00.000Z",
    seller: {
      id: "seller_user_id",
      name: "John Smith",
      isVerified: true
    }
  },
  {
    id: "listing_102",
    title: "Biology 101 Textbook 5th Edition",
    description: "Highlighted in a few chapters but perfectly readable.",
    price: 45.00,
    condition: "USED_GOOD",
    category: "BOOKS",
    campus: "South Campus",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    isSoldOut: false,
    createdAt: "2023-10-26T09:15:00.000Z",
    seller: {
      id: "seller_user_id2",
      name: "Sarah Connor",
      isVerified: false
    }
  },
  {
    id: "listing_103",
    title: "iPhone 13 Pro - 256GB",
    description: "Perfect condition, battery health 95%. Includes original box and accessories.",
    price: 650.00,
    condition: "USED_LIKE_NEW",
    category: "ELECTRONICS",
    campus: "Main Campus",
    imageUrl: "https://images.unsplash.com/photo-1592286927505-c0d0e0c5d7c0?w=500",
    isSoldOut: false,
    createdAt: "2023-10-27T11:20:00.000Z",
    seller: {
      id: "seller_user_id3",
      name: "Mike Johnson",
      isVerified: true
    }
  },
  {
    id: "listing_104",
    title: "Desk Lamp - Modern LED",
    description: "Adjustable brightness, USB charging port. Great for studying.",
    price: 25.00,
    condition: "NEW",
    category: "FURNITURE",
    campus: "East Campus",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    isSoldOut: false,
    createdAt: "2023-10-27T14:45:00.000Z",
    seller: {
      id: "seller_user_id4",
      name: "Emma Davis",
      isVerified: true
    }
  },
  {
    id: "listing_105",
    title: "Winter Jacket - North Face",
    description: "Size M, barely worn. Perfect for cold weather.",
    price: 80.00,
    condition: "USED_LIKE_NEW",
    category: "CLOTHING",
    campus: "North Campus",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    isSoldOut: false,
    createdAt: "2023-10-28T08:30:00.000Z",
    seller: {
      id: "seller_user_id5",
      name: "Alex Brown",
      isVerified: false
    }
  },
  {
    id: "listing_106",
    title: "Gaming Mouse - Logitech G502",
    description: "Wireless, RGB lighting, programmable buttons. Works perfectly.",
    price: 55.00,
    condition: "USED_GOOD",
    category: "ELECTRONICS",
    campus: "South Campus",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    isSoldOut: false,
    createdAt: "2023-10-28T16:00:00.000Z",
    seller: {
      id: "seller_user_id6",
      name: "Chris Lee",
      isVerified: true
    }
  },
  {
    id: "listing_107",
    title: "Calculus Textbook Bundle",
    description: "Calculus I & II textbooks with solution manuals. Minor wear.",
    price: 90.00,
    condition: "USED_GOOD",
    category: "BOOKS",
    campus: "Main Campus",
    imageUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500",
    isSoldOut: false,
    createdAt: "2023-10-29T10:15:00.000Z",
    seller: {
      id: "seller_user_id7",
      name: "Jessica White",
      isVerified: true
    }
  },
  {
    id: "listing_108",
    title: "Mini Fridge - Compact",
    description: "Perfect for dorm room. 1.7 cubic feet, works great.",
    price: 75.00,
    condition: "USED_GOOD",
    category: "FURNITURE",
    campus: "East Campus",
    imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500",
    isSoldOut: true,
    createdAt: "2023-10-29T13:40:00.000Z",
    seller: {
      id: "seller_user_id8",
      name: "David Martinez",
      isVerified: false
    }
  }
];

export const CATEGORIES = [
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "BOOKS", label: "Books" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "OTHER", label: "Other" }
];

export const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "USED_LIKE_NEW", label: "Like New" },
  { value: "USED_GOOD", label: "Good" },
  { value: "USED_FAIR", label: "Fair" }
];

export const CAMPUSES = [
  { value: "North Campus", label: "North Campus" },
  { value: "South Campus", label: "South Campus" },
  { value: "Main Campus", label: "Main Campus" },
  { value: "East Campus", label: "East Campus" }
];
