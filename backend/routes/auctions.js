 import express from 'express';
 import { Auction, User } from '../models/index.js';
 import requireUser from '../middleware/supabaseAuth.js';
 import { getHighestBid } from '../services/auctionService.js';
 const router = express.Router();
 // create auction (seller only)
 router.post('/', requireUser, async (req, res) => {
  try {
    const supaId = req.user.id;
    const profile = await User.findByPk(supaId);
    if (!profile || profile.role !== 'seller') return res.status(403).json({ error: 'Only sellers' });
    const { title, description, start_price, bid_increment, start_time, end_time } = req.body;
    const now = new Date();
    let status = 'upcoming';

    if (now >= new Date(start_time) && now <= new Date(end_time)) {
      status = 'active';
    } else if (now > new Date(end_time)) {
      status = 'ended';
    }

    const auction = await Auction.create({
  seller_id: supaId,
  title,
  description,
  start_price,
  bid_increment,
  start_time,
  end_time,
  status
});
    res.json(auction);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
 });
 // list auctions (public)
 router.get('/', async (req, res) => {
  const list = await Auction.findAll({ include: [{ model: User, as: 'seller', attributes: ['id','name'] 
}], order: [['created_at','DESC']] });
  res.json(list);
 });
 // get single auction + current highest
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const auction = await Auction.findByPk(id, {
    include: [{ model: User, as: 'seller', attributes: ['id', 'name'] }]
  });

  if (!auction) {
    return res.status(404).json({ error: 'Not found' });
  }

  // --- Calculate status dynamically ---
  const now = new Date();
  const start = new Date(auction.start_time);
  const end = new Date(auction.end_time);

  let status;
  if (now < start) {
    status = 'upcoming';
  } else if (now >= start && now <= end) {
    status = 'ongoing';
  } else {
    status = 'ended';
  }

  // Get highest bid from Redis or DB fallback
  const redisHighest = await getHighestBid(auction.id);
  const current = redisHighest ?? parseFloat(auction.highest_bid_amount ?? auction.start_price);

  res.json({
    auction: {
      ...auction.toJSON(),
      status // override status with calculated one
    },
    current
  });
});

 export default router;