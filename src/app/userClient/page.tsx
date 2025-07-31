'use client';

import { useState, useEffect } from 'react';

export default function Create() {
  const [categoryId, setCategoryId] = useState('');
  const [ans, setAns] = useState('');
  const [capitalAns, setCapitalAns] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Connect to WebSocket server
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.capital) {
          setCapitalAns(data.capital);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  // Join category room
  const handleJoin = () => {
    if (ws && categoryId) {
      ws.send(JSON.stringify({ action: 'join', categoryId }));
      console.log(`Joined category ${categoryId}`);
    }
  };

  // Submit answer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !ans) {
      alert('Please enter categoryId and answer');
      return;
    }

    try {
      const response = await fetch('/api/createTweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, ans }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const result = await response.json();
      console.log(result);
      setAns(''); // Clear input
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer');
    }
  };

  return (
    <div>
      <h1>WebSocket Test</h1>
      <div>
        <input
          type="text"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
        <button onClick={handleJoin} disabled={!ws || !categoryId}>
          Join Category
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Answer"
          value={ans}
          onChange={(e) => setAns(e.target.value)}
        />
        <button type="submit">Submit Answer</button>
      </form>
      {capitalAns && (
        <div>
          <h2>Capitalized Answer:</h2>
          <p>{capitalAns}</p>
        </div>
      )}
    </div>
  );
}









/*
'use client'
import { useState } from "react";
import axios from "axios";

export default function  UserClient() {
const[categoryId,setCategoryId]=useState<string>('')
const[ans,setAns]=useState<string>('')
const[wsResponse,setWsResponse]=useState<string>('')
const[ws,setWs]=useState<WebSocket|null>(null)
const[isConnected,setIsConnected]=useState<boolean>(false)
const[status,setStatus]=useState<string>('')

const join=()=>{
const socket= new WebSocket("ws://localhost:8080")
socket.onopen=()=>{
setWs(socket)//join 
socket.send(JSON.stringify({action:'join',categoryId}))//join with sending catogryid for room 
setIsConnected(true)
}
socket.onmessage=(event)=>{
const msg=JSON.parse(event.data)as{capital:string}//receive msg 
setWsResponse(msg.capital)
}
socket.onclose=()=>{
setWs(null)
setIsConnected(false)
}
}
const sendViaBackend=async()=>{
try{
const response=await axios.post('/api/createTweets',{categoryId,ans},{headers:{'Content-Type':"application/json"}})
if(response.status===201){
setAns('')
}
}catch{
return setStatus('try catch err ')
}
}
const sendViaws=()=>{
if(ws)return 
}
return (<div>

<input
type="text"
placeholder='enter catogry id'
value={categoryId}
onChange={(e)=>setCategoryId(e.target.value)}
/>
<button className="bg-green-400 hover:bg-amber-50"  onClick={join}  >join ws </button>
<p>{isConnected?'connected':"disconnected "}</p>

<input
type="text"
placeholder='enter ans'
value={ans}
onChange={(e)=>setAns(e.target.value)}
/>
<button onClick={sendViaBackend} className="bg-orange-900 hover:bg-amber-50">send ans </button>


<p>status: {status}</p>
<p>response: {wsResponse}</p>
<button onClick={sendViaws}>nothing </button>
</div>)
}
*/