# 🎨 Frontend Architecture Blueprint (Student Market)

This document contains every single page, tab, and feature the Frontend Developer needs to build for the complete Student Market application. It is based exactly on our Prisma Schema database relationships.

---

## 🔒 1. Authentication Pages (Already Built)
- `[x]` **Login Page** (`/login`): Email & Password fields.
- `[x]` **Registration Page** (`/register`): Name, Email, Password, Role (Buyer/Seller).

---

## 🛒 2. Public Access Pages (Viewable by anyone)

### **Home Feed** (`/`)
*The main landing page and browsing hub.*
- **Global Search Bar**: Search listings by title/keyword.
- **Filter/Sort Sidebar**: Filter by `Category`, `Campus`, `Condition`, and Sort by Price.
- **Product Grid**: A grid of cards displaying active listings. Each card must show: Image, Title, Price, Condition, and Date posted.

### **Single Listing Details** (`/listing/[id]`)
*When a user clicks a product card.*
- **Image Gallery**: Display the product image (`imageUrl`).
- **Product Info**: Show Title, Price, Condition, Category, Campus, and full Description.
- **Seller Profile Summary**: Show Seller's name and whether they are verified (`isVerified`).
- **Action Buttons**:
  - If user is logged out -> "Log in to Bid/Buy"
  - If user is logged in -> "Place a Bid" or "Buy Now"

---

## 👤 3. Authenticated User Dashboard (Protected)

This section should likely be a side-navigation layout (e.g., `/dashboard/*`) or a tabbed interface.

### **Tab 1: My Profile** (`/dashboard/profile`)
- Display personal info (Name, Email, Role).
- **Verification Status**: Show if the user's Ghana Card is verified.
- **Ghana Card Upload** (Form): A form to submit their `ghanaCardNumber` for verification.

### **Tab 2: My Listings (Sellers Only)** (`/dashboard/listings`)
- A table/list of all items this specific user is selling.
- **Status Badges**: Show whether an item is "Active" or "Sold Out".
- **Action**: "Mark as Sold" button.
- **Action**: "Delete Listing" button.

### **Tab 3: Create New Listing (Sellers Only)** (`/create-listing`)
*A full-page form to post a new item.*
- **Inputs**: Title, Description, Price (Number), Condition (Dropdown), Category (Dropdown), Campus (Dropdown), Image Upload (File input/URL).

### **Tab 4: My Bids (Buyers Only)** (`/dashboard/bids`)
- A list of all the bids the user has placed securely on items.
- **Status Badges**: Link the bid to the item it was placed on, and show the bid status (`PENDING`, `ACCEPTED`, `REJECTED`).

---

## 💬 4. Messaging System (`/messages`)
*A real-time or polling-based chat interface to negotiate prices and arrange meetups.*

- **Sidebar (Conversations List)**: A list of users you have spoken to (linked via `senderId` and `receiverId`). 
- **Main Chat Window**: The active conversation history ordered by `createdAt`.
- **Message Input Form**: Text area and "Send" button.

---

## 💳 5. Secure Transactions & Escrow (`/dashboard/transactions`)
*This handles the safe-exchange logic mapped to the `Transaction` table.*

- **Buyer View**: 
  - List of items they purchased.
  - Status indicator (`HELD_IN_ESCROW`, `RELEASED_TO_SELLER`, `REFUNDED`, `DISPUTED`).
  - **Action Button**: "Confirm Item Received" (Changes status to `RELEASED_TO_SELLER`).
- **Seller View**:
  - List of items they sold.
  - Status indicator for the funds.

---

## ⚠️ 6. Global UI States & Components 
*These are the crucial edge-cases and reusable components that make the app feel premium.*

- **Loading Skeletons**: Display shimmering placeholder shapes while fetching data from the API (e.g., while waiting for the Listing Grid or Single Item to load).
- **Toast Notifications**: Small popups (like React Hot Toast) to show success/errors (e.g., "Bid Placed Successfully!", "Invalid Password").
- **Empty States**: Beautifully designed screens for when there is no data (e.g., "You have no active listings right now." or "No search results found.").
- **404 Not Found Page** (`/app/not-found.tsx`): A custom page for when a user visits a broken link or a deleted item.
- **Global Error Boundary**: Catch-all error screens so the application doesn't crash completely if a visual bug occurs.

---

## 🚀 How to Push Your Frontend Work to GitHub

Whenever you finish a feature (like building the Home Feed UI) and you are ready to let the Backend Developer (Mike) test it, you must push your code from your branch. 

**Follow these exact terminal commands inside the `/frontend` folder:**

1. **Check what files you changed:**
   ```bash
   git status
   ```
2. **Add all your changed files to the staging area:**
   ```bash
   git add .
   ```
3. **Commit your changes with a descriptive message:**
   ```bash
   git commit -m "feat: built the main listings grid UI and loading skeletons"
   ```
4. **Push your code to your specific remote branch:**
   ```bash
   git push origin <your-branch-name>
   ```
   *(e.g., `git push origin feature/frontend-listings`)*

5. **Automate the Merge (For the AI):** 
   If you have the GitHub CLI (`gh`) installed, you can tell your AI assistant to automatically create a Pull Request and merge it directly from the terminal without opening a browser! Have your AI run these commands:
   ```bash
   # Create the Pull Request automatically
   gh pr create --title "feat: added frontend listings UI" --body "Automated PR created by AI" --base main
   
   # Merge the Pull Request automatically
   gh pr merge --merge --auto
   ```

---

### 📝 Next Steps for Frontend Dev:
1. Use a library like `react-router` (if Expo/React Native) or Next.js App Router folders to instantly map out placeholder files for every page listed above.
2. Build the UI components for the **Home Feed** (`/`) and **Create New Listing** (`/create-listing`) using the Mock JSON provided in the `api_contracts.md` file!
