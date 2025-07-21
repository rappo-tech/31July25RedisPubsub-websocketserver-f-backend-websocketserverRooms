'use client'

import { useCallback, useState, useEffect } from "react"
import axios from "axios"

export default function CreateAdmin() {
  const [catogry, setCatogry] = useState<string>('')
  const [prodName, setProdName] = useState<string>('')
  const [joinedCategory, setJoinedCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [wsResponse, setWsResponse] = useState<string>('')
  const [ws, setWs] = useState<WebSocket|null>(null)
  
  const connectWs=useCallback(()=>{
  if(ws) return
    const socket = new WebSocket('ws://localhost:8080')
    socket.onopen = () => {
      setWs(socket)
      setIsConnected(true)
      console.log('Connected to WebSocket')
    }
    
    socket.onmessage = (event) => {
      if(event.data) {
        const parsed = JSON.parse(event.data)
        
        if(parsed.type === 'joined') {
          setStatus(`Joined: ${parsed.catogry}`)
          setJoinedCategory(parsed.catogry)
        } else if(parsed.type === 'message') {
          setWsResponse(`[${parsed.catogry}] ${parsed.prodName} (${parsed.timestamp})`)
        }
        
        console.log('Received:', parsed)
      }
    }
    
    socket.onclose = () => {
      setWs(null)
      setIsConnected(false)
      setJoinedCategory('')
      console.log('WebSocket disconnected')
    }

  },[ws])

  // Join a category room
  const joinCategory = () => {
    if(!catogry) {
      setStatus('Enter category first!')
      return
    }
    
    if(ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        action: 'join',
        catogry: catogry
      }))
      console.log(`Joining category: ${catogry}`)
    } else {
      setStatus('Not connected to WebSocket!')
    }
  }
  // Auto-join category and send message via API
  const sendToAPI = useCallback(async() => {
    if(!catogry || !prodName) {
      setStatus('Fill both fields!')
      return
    }
    
    // Auto-join the category if not already joined
    if(ws && ws.readyState === WebSocket.OPEN && joinedCategory !== catogry) {
      ws.send(JSON.stringify({
        action: 'join',
        catogry: catogry
      }))
      setJoinedCategory(catogry)
      console.log(`Auto-joined category: ${catogry}`)
    }
    
    try {
      const response = await axios.post('/api/createProds', {prodName, catogry}, {
        headers: {'Content-Type': "application/json"}
      })
      if(response.status === 201) {
        setStatus(`API: Message sent to ${catogry}`)
      }
    } catch(error) {
      console.error('API error:', error)
      setStatus('API request failed')
    }
  }, [catogry, prodName, ws, joinedCategory])


  // Auto-connect on mount
  useEffect(() => {
    connectWs()
    return () => {
      if(ws) ws.close()
    }
  }, [ws,connectWs])



  return (
    <div>
      <div>
        <input
          type="text"
          placeholder='Enter category'
          value={catogry}
          onChange={(e) => setCatogry(e.target.value)}
        />
        <button onClick={joinCategory}>Join Category</button>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Enter product name"
          value={prodName}
          onChange={(e) => setProdName(e.target.value)}
        />
        <button onClick={sendToAPI}>Send Message</button>
      </div>
      
      <div>
        <p>WS Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <p>Joined Category: {joinedCategory || 'None'}</p>
        <p>Status: {status}</p>
        <p>Messages: {wsResponse}</p>
      </div>
    </div>
  )
}