

---

## Mini Auction Platform

A modern, professional digital auction platform that connects buyers and sellers seamlessly. Users can explore live auctions, participate in bidding, and manage their assets efficiently. Sellers can create auctions with real-time countdowns and secure bidding features.

---
Live Site: https://mini-auction-1.onrender.com/
[Demo Video Link](https://drive.google.com/file/d/1HiXsN0J4VPiqcHKJ1eoAbSaDmOmKtie-/view?usp=sharing)


## Features

* **User Authentication**: Sign up as a Buyer or Seller and log in securely.
* **Auction Creation**: Sellers can create auctions with title, description, starting price, bid increment, and start/end times.
* **Live Auctions**: Buyers can view ongoing and upcoming auctions with real-time countdowns.
* **Role-based Access**: Only logged-in sellers can create auctions.
* **Responsive UI**: Fully responsive landing page, auction list, and forms.
* **Dark Themed Interface**: Professional dark UI with smooth animations.

---

## Tech Stack

* **Frontend**: React.js
* **Backend**: Node.js 
* **Real-Time Communication**: WebSockets
* **Database & Auth**: Supabase (PostgreSQL)
* **Caching**: Redis (Upstash)
* **HTTP Client**: Axios
* **UI Components**: ShadCN, Tailwind CSS, Framer Motion



---

## Usage

* **Landing Page**:
  Explore featured auctions, navigate to login or register.

* **Register / Login**:
  Create an account as Buyer or Seller. Sellers gain access to auction creation.

* **Create Auction** (Sellers only):
  Fill out title, description, start price, bid increment, start and end time. Only logged-in sellers can create auctions.

* **Active Auctions**:
  View all live and upcoming auctions with real-time countdowns. Click on an auction to view details and place bids.

---


## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Niiihariiikaa/mini-auction.git
   cd mini-auction
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root with Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the application**

   ```bash
   npm run dev
   ```

5. **Access in browser**

   ```
   http://localhost:5173
   ```

---

## Usage

* **Landing Page**:
  Explore featured auctions, navigate to login or register.

* **Register / Login**:
  Create an account as Buyer or Seller. Sellers gain access to auction creation.

* **Create Auction** (Sellers only):
  Fill out title, description, start price, bid increment, start and end time. Only logged-in sellers can create auctions.

* **Active Auctions**:
  View all live and upcoming auctions with real-time countdowns. Click on an auction to view details and place bids.

---

## Folder Structure

```
src/
├─ components/      # UI Components (Cards, Buttons, Inputs, etc.)
├─ lib/             # Supabase & API configuration
├─ pages/           # Landing page, Login, Register, Auctions
├─ App.jsx          # Main application
├─ main.jsx         # Entry point
```

---

## Notes

* Ensure users are logged in before attempting to create auctions; non-authenticated users are redirected to login.
* Countdown timers update every second for live auctions.

