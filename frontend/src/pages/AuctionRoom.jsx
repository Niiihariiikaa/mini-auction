import React, { useEffect, useState } from 'react';
import API from '../api.js';
import { socket } from '../socket.js';
import { getUser } from '../store.js';

export default function AuctionRoom(){
  const auctionId = window.location.hash.split('/').pop();
  const [auction, setAuction] = useState(null);
  const [high, setHigh] = useState(null);
  const [amount, setAmount] = useState('');
  const [toast, setToast] = useState('');

  useEffect(()=>{
    API.get(`/auctions/${auctionId}`).then(r=>{ setAuction(r.data.auction); setHigh(r.data.highBid); });
    socket.emit('auction:join', { auctionId });
    socket.on('bid:new', ({ highBid }) => setHigh(highBid));
    socket.on('notify:outbid', ({ userId })=>{ if (getUser()?.id === userId) setToast('You were outbid!'); });
    socket.on('auction:ended', ({ high })=>{ setToast('Auction ended'); setHigh(high); });
    socket.on('auction:live', ()=>setToast('Auction is live!'));
    socket.on('bid:error', (e)=>setToast(e.message));
    return ()=>{ socket.off('bid:new'); socket.off('notify:outbid'); socket.off('auction:ended'); socket.off('auction:live'); socket.off('bid:error'); };
  },[auctionId]);

  if (!auction) return <p>Loading...</p>;

  const now = Date.now();
  const start = new Date(auction.goLiveAt).getTime();
  const end = start + auction.durationSec*1000;
  const active = now>=start && now<=end && auction.status!=='closed';

  const place = ()=>{
    if (!getUser()) return alert('Sign in from Create page first');
    socket.emit('bid:place', { auctionId, userId: getUser().id, amount: Number(amount) });
  };

  const minNext = (high? high.amount : auction.startingPrice) + auction.bidIncrement;

  return (
    <div className="card">
      <h2>{auction.title}</h2>
      <p>{auction.description}</p>
      <div className="row"><span className="badge">Inc: ${auction.bidIncrement/100}</span><span className="badge">Status: {auction.status}</span></div>
      <h3>Current Highest: ${ (high? high.amount : auction.startingPrice)/100 }</h3>
      <p className="timer">Ends at: {new Date(end).toLocaleString()}</p>
      <div className="row">
        <input className="number" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder={`Min ${minNext}`}/>
        <button className="btn primary" disabled={!active} onClick={place}>Place Bid</button>
      </div>
      <hr/>
      {auction.status==='ended' && auction.sellerId===getUser()?.id && (
        <SellerActions auction={auction} high={high} />
      )}
      {toast && <div className="toast" onClick={()=>setToast('')}>{toast}</div>}
    </div>
  );
}

function SellerActions({ auction, high }){
  const [counter, setCounter] = useState('');
  const accept = ()=> fetch(`/api/auctions/${auction.id}/finalize`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ decision:'accept', sellerId: auction.sellerId })}).then(()=>alert('Accepted'));
  const reject = ()=> fetch(`/api/auctions/${auction.id}/finalize`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ decision:'reject', sellerId: auction.sellerId })}).then(()=>alert('Rejected'));
  const makeCounter = ()=> fetch(`/api/auctions/${auction.id}/counter`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sellerId: auction.sellerId, amount: Number(counter), buyerId: high?.userId })}).then(()=>alert('Counter sent'));
  if (!high) return <p>No bids received.</p>;
  return (
    <div>
      <h3>Highest Bid: ${high.amount/100}</h3>
      <div className="row">
        <button className="btn primary" onClick={accept}>Accept</button>
        <button className="btn" onClick={reject}>Reject</button>
      </div>
      <div className="row" style={{marginTop:8}}>
        <input className="number" type="number" value={counter} onChange={e=>setCounter(e.target.value)} placeholder="Counter (cents)"/>
        <button className="btn" onClick={makeCounter}>Send Counter</button>
      </div>
    </div>
  );
}

