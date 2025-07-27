'use client'

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
interface resProd{
categoryId:string, 
categoryName:string, 
allCloth:string[]
}


 export default function UserClient() {

const[allProds,setAllProds]=useState<resProd[]>([])
const[status,setStatus]=useState<string>('')
const[ws,setWs]=useState<WebSocket|null>(null)
const[wsResponse,setWsResponse]=useState<string>('')
const[isConnected,setIsConnected]=useState<boolean>(false)
const[totalUsers,setTotalUsers]=useState<string>('')


//join,recieve msg 
const join=(categoryId:string)=>{
const socket=new WebSocket("ws://localhost:8080")
socket.onopen=()=>{
setWs(socket)
socket.send(JSON.stringify({action:"JOIN",categoryId}))
setIsConnected(true)
}
socket.onmessage=(event)=>{
const capitalResponse=JSON.parse(event.data)
setWsResponse(capitalResponse.capital)
setTotalUsers(capitalResponse.totalUsers)
}
socket.onclose=()=>{
setIsConnected(false)
setWs(null)
}

}

const sendmsgviaws=()=>{
if(ws){
ws.send(JSON.stringify({type:'JOIN'}))
}
}




const getProds=useCallback(async()=>{
try{
const response=await axios.get('/api/getClothsNCategory')
if(response.status===201){
setAllProds(response.data)
}
}catch{
setStatus('try catch err ')
}
},[])

useEffect(()=>{
getProds()
},[getProds])


return(<div>

<p className="bg-orange-600">{isConnected?'connected ':"disconnected "}</p>
<p className="bg-teal-300">active users on catIgoryId: {totalUsers}</p>

<p>response:{wsResponse}</p>

<div>{
allProds.map((elemnt,index)=>{
return <div key={index}>
<p> category name:{elemnt.categoryName}</p>
<button className="bg-pink-600 hover:bg-yellow-300" onClick={()=>join(elemnt.categoryId)}  >JOIN WS with categoryId:{elemnt.categoryId}</button>
<div>{
elemnt.allCloth.map((elemnt2,index2)=>{
return <div key={index2}>
<p>clothName: {elemnt2}</p>
</div>
})
    }</div>
</div>
})
    }</div>

<p>status:{status} </p>

<Link href={'/adminClient'}>
<button className="bg-orange-700 hover:bg-amber-400 ">go to admin </button>
</Link>


<button onClick={sendmsgviaws}> join via fonetdn </button>

</div>
)
}
 