import React, { useEffect, useState } from 'react';
import API from '../api.js';

export default function Home(){
  const [auctions, setAuctions] = useState([]);
  useEffect(()=>{ API.get('/auctions').then(r=>setAuctions(r.data)); },[]);
  return (
    <div>
      <h2>Live & Upcoming Auctions</h2>
      <div className="grid">
        {auctions.map(a=> (
          <div key={a.id} className="card">
            <h3>{a.title}</h3>
            <p>{a.description}</p>
            <div className="row">
              <span className="badge">Start: ${a.startingPrice/100}</span>
              <span className="badge">Inc: ${a.bidIncrement/100}</span>
              <span className="badge">Status: {a.status}</span>
            </div>
            <button className="btn primary" onClick={()=>window.location.hash = `#/auction/${a.id}`}>Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}
