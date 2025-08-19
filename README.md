
# Mini Auction Platform

A full-stack **real-time online auction platform** that enables sellers to list items for auction and buyers to place live bids. The platform provides countdown timers, featured auctions, and instant updates using WebSockets.

---


## Demo

* **Live Site:** \[https://mini-auction-1.onrender.com/]
* **Demo Video:** \[(https://drive.google.com/file/d/1HiXsN0J4VPiqcHKJ1eoAbSaDmOmKtie-/view?usp=sharing)]

---

## Features

* User authentication (Supabase)
* Role-based access (Buyer / Seller)
* Create, start, and end auctions (Seller only)
* Place live bids with real-time updates (Buyer only)
* Responsive, modern UI with Tailwind CSS & shadcn/ui
* Live WebSocket integration for instant bid updates

---

## Tech Stack

* **Frontend:** React.js / Vue.js (React implementation in this repo)
* **Backend:** Node.js / Django (Node.js implementation in this repo)
* **Real-Time Communication:** WebSockets
* **Database:** Supabase (PostgreSQL)
* **Redis:** Upstash (for caching and sessions)
* **Styling:** Tailwind CSS + shadcn/ui

---

## Project Structure

```
auction-mvp/
│── backend/             # Node.js backend with REST API & WebSockets
│   ├── routes/          # API route handlers
│   ├── models/          # Database models
│   ├── server.js        # Entry point
│
│── frontend/            # React.js frontend
│   ├── src/
│   │   ├── pages/       # Login, Register, Auctions, Landing Page
│   │   ├── components/  # UI components
│   │   ├── lib/         # API & Supabase client
│   │   └── App.jsx
│
│── README.md
│── package.json
```

---

## API Endpoints

### Auctions

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| GET    | `/auctions`           | List all auctions                |
| POST   | `/auctions`           | Create auction (seller only)     |
| GET    | `/auctions/:id`       | Get single auction + current bid |
| POST   | `/auctions/:id/start` | Start auction (seller only)      |
| POST   | `/auctions/:id/end`   | End auction (seller only)        |

### Bids

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| POST   | `/bids`  | Place bid (buyer only) |

---

## Installation

### Prerequisites

* Node.js >= 18
* Supabase project setup
* Redis (Upstash) setup

### Steps

1. **Clone repository**

   ```bash
   git clone https://github.com/Niiihariiikaa/mini-auction
   cd auction-mvp
   ```

2. **Setup backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add Supabase & Redis credentials in .env
   npm start
   ```

3. **Setup frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Visit app at:

   ```
   http://localhost:5173
   ```

---

## Usage

* **Register/Login** as buyer or seller
* **Seller:** Create auction → Start auction → End auction
* **Buyer:** View auctions → Place bids in real-time
* Featured auctions are displayed on the landing page



## Future Improvements

* Payment gateway integration
* Notifications (Email/SMS) for bids
* Analytics for sellers (bidding trends, revenue reports)
* AI-based price predictions

---



