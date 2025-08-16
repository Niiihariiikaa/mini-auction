import React, { useEffect, useState } from 'react';
import API from '../api.js';
export default function Admin(){
  const [auctions, setAuctions] = useState([]);
  useEffect(()=>{ API.get('/auctions').then(r=>setAuctions(r.data)); },[]);
  return (
    <div>
      <h2>Admin</h2>
      <table>
        <thead><tr><th>Title</th><th>Status</th><th>Go‑Live</th><th>Duration</th></tr></thead>
        <tbody>
          {auctions.map(a=> (
            <tr key={a.id}><td>{a.title}</td><td>{a.status}</td><td>{new Date(a.goLiveAt).toLocaleString()}</td><td>{a.durationSec}s</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}