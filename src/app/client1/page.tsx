'use client'

import { useState } from "react"
import axios from "axios"

export default function  Create() {
const[msg,setMsg]=useState<string>('')
const[ws,setWs]=useState<WebSocket | null> (null)
const[isConnected,setIsConnected]=useState<boolean>(false)
const[wsResponse,setWsResponse]=useState<string>('')
const[status,setStatus]=useState<string>('')

const join=()=>{
if(ws){
return 
}
const socket=new WebSocket('ws://localhost:8080')


socket.onopen=()=>{
setWs(socket)
setIsConnected(true)
}

socket.onmessage=(event)=>{
setWsResponse(event.data)
setWs(socket)
setIsConnected(true)
}

socket.onclose=()=>{
setWs(null)
setIsConnected(false)
}

}
const sendToBackend=async()=>{
try{
const response=await axios.post('/api/websocket',{msg},{headers:{'Content-Type':'application/json'}})
if(response.status===201){
setStatus(response.data)
}
}catch{
setStatus('try catch err ')
}
}
const sendMsg=()=>{
if(ws && msg){
ws.send(msg)// directly sending  the msg to websocket 
sendToBackend()
}
}

const disconnect=()=>{
setWs(null)
setIsConnected(false)
}

return (<div>

<button className="bg-yellow-500" onClick={join}>join ws </button>
<p className="bg-green-600">{isConnected?'connected ':"disconnnected "}</p>


<input
type="text"
placeholder="enter msg ... "
value={msg}
onChange={(e)=>setMsg(e.target.value)}
/>

<button className="bg-amber-300" onClick={sendMsg}>send msg  </button>

<button className="bg-violet-500">response:{wsResponse}</button>

<p>status:{status}</p>

<button className="bg-red-500" onClick={disconnect}>disconnected </button>

 
</div>)
}