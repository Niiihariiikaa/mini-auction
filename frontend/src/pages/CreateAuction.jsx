import React, { useState } from 'react';
import API from '../api.js';
import { getUser, setUser } from '../store.js';

export default function CreateAuction(){
  const [form, setForm] = useState({ title:'', description:'', startingPrice:1000, bidIncrement:100, goLiveAt:'', durationSec:120 });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const user = getUser();

  const signin = async ()=>{
    const r = await API.post('/auth', { email, name });
    setUser(r.data);
    alert('Signed in as '+r.data.name);
  };

  const submit = async ()=>{
    if (!getUser()) return alert('Sign in first');
    const payload = { ...form, startingPrice: Number(form.startingPrice), bidIncrement: Number(form.bidIncrement), sellerId: getUser().id };
    const r = await API.post('/auctions', payload);
    window.location.hash = `#/auction/${r.data.id}`;
  };

  return (
    <div className="card" style={{maxWidth:600}}>
      <h2>Create Auction</h2>
      {!user && (
        <div className="card">
          <h4>Quick Sign‑In</h4>
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="btn" onClick={signin}>Sign In</button>
        </div>
      )}
      <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
      <textarea className="textarea" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
      <input className="number" type="number" placeholder="Starting price (cents)" value={form.startingPrice} onChange={e=>setForm({...form,startingPrice:e.target.value})} />
      <input className="number" type="number" placeholder="Bid increment (cents)" value={form.bidIncrement} onChange={e=>setForm({...form,bidIncrement:e.target.value})} />
      <input className="datetime" type="datetime-local" value={form.goLiveAt} onChange={e=>setForm({...form,goLiveAt:e.target.value})} />
      <input className="number" type="number" placeholder="Duration (sec)" value={form.durationSec} onChange={e=>setForm({...form,durationSec:e.target.value})} />
      <button className="btn primary" onClick={submit}>Create</button>
    </div>
  );
}
