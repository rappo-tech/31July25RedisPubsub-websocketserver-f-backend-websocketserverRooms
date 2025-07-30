'use client'

import { useCallback, useEffect, useState } from "react"
import { typeAllTweets } from "../adminClient/page"
import axios from "axios"


export default function UserClient() {
const[ws,setWs]=useState<WebSocket|null>(null)
const[isConnected,setIsConnected]=useState<boolean>(false)
const[allTweets,setAllTweets]=useState<typeAllTweets[]>([])
const[status,setStatus]=useState<string>('')

const join=(tweetId:string)=>{
const socket= new WebSocket("ws://localhost:8080")
socket.onopen=()=>{
setWs(socket)
socket.send(JSON.stringify({action:"join",tweetId}))
setIsConnected(true)
}
socket.onmessage=(event)=>{
const msg=JSON.parse(event.data)
setAllTweets(msg.all)
}
socket.onclose=()=>{
setIsConnected(false)
setWs(null)
setStatus('ws gone ')
}
}


const sendviawebsocket=()=>{
if(ws) return 
}

const getTweets=useCallback(async()=>{
try{
const response=await axios.get('/api/getTweets')
if(response.status===201){
setAllTweets(response.data)
}
}catch{
setStatus('try catch err tweets ')
}
},[])



useEffect(()=> {
getTweets()
},[getTweets])




return (<div>








<p>{isConnected?'connected ':"disconnected "}</p>
<div>{
allTweets.map((element,index)=>{
return <div key={index}>
<p>{element.tweetName}</p>
<button className="bg-green-700 hover:bg-amber-100" >{element.id }</button>
<p>{element.like}</p>
<button className="bg-amber-600  hover:bg-amber-100" onClick={()=>join(element.id)} >join ws </button>
</div>
})
    }</div>

<p>status:{status}</p>


<button onClick={sendviawebsocket}>send  via ws </button>


</div>)

}


