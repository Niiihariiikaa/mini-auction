import { Router } from 'express';
import { Auction, Bid, User, CounterOffer } from './models.js';
import { redis, highBidKey, statusKey } from './redis.js';

export function api(io) {
  const r = Router();

  // demo auth — create/get user by email
  r.post('/auth', async (req, res) => {
    const { email, name } = req.body;
    let user = await User.findOne({ where: { email } });
    if (!user) user = await User.create({ email, name });
    res.json(user);
  });

  r.post('/auctions', async (req, res) => {
    const { title, description, startingPrice, bidIncrement, goLiveAt, durationSec, sellerId } = req.body;
    const a = await Auction.create({ title, description, startingPrice, bidIncrement, goLiveAt, durationSec, sellerId, status: 'scheduled' });
    res.json(a);
  });

  r.get('/auctions', async (req, res) => {
    const list = await Auction.findAll({ order: [['createdAt','DESC']] });
    res.json(list);
  });

  r.get('/auctions/:id', async (req, res) => {
    const a = await Auction.findByPk(req.params.id);
    if (!a) return res.status(404).end();
    const high = await redis.get(highBidKey(a.id));
    res.json({ auction: a, highBid: high ? JSON.parse(high) : null });
  });

  // Seller decision actions
  r.post('/auctions/:id/accept', async (req, res) => {
    const a = await Auction.findByPk(req.params.id);
    if (!a) return res.status(404).end();
    const high = JSON.parse(await redis.get(highBidKey(a.id)) || 'null');
    if (!high) return res.status(400).json({ error: 'No bid' });
    a.status = 'closed';
    await a.save();
    io.to(a.id).emit('auction:closed', { auctionId: a.id, result: 'accepted', high });
    res.json({ ok: true });
  });

  r.post('/auctions/:id/reject', async (req, res) => {
    const a = await Auction.findByPk(req.params.id);
    if (!a) return res.status(404).end();
    a.status = 'closed';
    await a.save();
    io.to(a.id).emit('auction:closed', { auctionId: a.id, result: 'rejected' });
    res.json({ ok: true });
  });

  r.post('/auctions/:id/counter', async (req, res) => {
    const a = await Auction.findByPk(req.params.id);
    const { sellerId, amount, buyerId } = req.body;
    if (!a) return res.status(404).end();
    const co = await CounterOffer.create({ auctionId: a.id, sellerId, buyerId, amount, status: 'pending' });
    io.to(a.id).emit('counter:created', { auctionId: a.id, counter: co });
    res.json(co);
  });

  r.post('/counter/:id/decision', async (req, res) => {
    const { decision } = req.body; // 'accept' | 'reject'
    const co = await CounterOffer.findByPk(req.params.id);
    if (!co) return res.status(404).end();
    co.status = decision === 'accept' ? 'accepted' : 'rejected';
    await co.save();
    const a = await Auction.findByPk(co.auctionId);
    if (decision === 'accept') a.status = 'closed';
    await a.save();
    res.json({ ok: true });
  });

  return r;
}