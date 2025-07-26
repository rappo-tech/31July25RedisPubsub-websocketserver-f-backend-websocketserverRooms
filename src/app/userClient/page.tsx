'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

interface catogryType{
categoryId:string, 
categoryName:string, 
prodsArr:string[]
}


export default function UserClient() {
const[ws,setWs]=useState<WebSocket|null>(null)
const[status,setStatus]=useState<string>('')
const[prodName,setProdName]=useState<string>('')
const[groupId,setGroupId]=useState<string>('')
const[wsResponse,setWsResponse]=useState<string>('')
const[isConnected,setIsConnected]=useState<boolean>(false)
const[catogryArr,setCatogryArr]=useState<catogryType[]>([])
const[categoryId,setCategoryId]=useState<string>('')


const getCatogry=async()=>{
try{
const response=await axios.get('/api/getCatogry')
if(response.status===201){
setCatogryArr(response.data)
}
}catch{
setStatus('try catch err ')
}
}

useEffect(()=>{
getCatogry()
},[])


const join=()=>{
if(ws) return 
const socket= new WebSocket("ws://localhost:8080")
socket.onopen=()=>{
setWs(socket)//join websocketserver 
setIsConnected(true)
socket.send(JSON.stringify({action:'join',groupId:categoryId}))
}
socket.onmessage=(event)=>{//receive msg 
const {capitalResponse}=JSON.parse(event.data)
setWsResponse(capitalResponse)
}
socket.onclose=()=>{
setWs(null)
setIsConnected(false)
}


}

const disconnnect=()=>{
setWs(null)
setIsConnected(false)
}

const sendToBackend=async ()=>{
try{
const response=await axios.post('/api/createProds',{groupId:categoryId,prodName},{headers:{'Content-Type':"application/json"}})
if(response.status===201){
setStatus(response.data)
}
}catch{
setStatus('err while backend ')
}
}

return (<div>
<p className="bg-red-800">catoogryId :{categoryId}</p>

<input
type="text"
placeholder="catogryId"
onChange={(e)=>setGroupId(e.target.value)}
value={groupId}
/>
<input
type="text"
placeholder="enter your prodName "
onChange={(e)=>setProdName(e.target.value)}
value={prodName}
/>
<button  className="bg-violet-950" onClick={sendToBackend}  >send backend  </button>



<button  className="bg-green-500" onClick={join}  >join </button>
<p className="bg-yellow-500">{isConnected?'connected':'disconnected '}</p>

<button  className="bg-green-500" onClick={disconnnect}  >disconnect  </button>


<p>status:{status}</p>
<p>response:{wsResponse}</p>


<div>{
catogryArr.map((elemnt,index)=>{
return <div key={index}>
<p className="bg-teal-400">{elemnt.categoryName}</p>
<button className="bg-amber-500 hover:bg-amber-50" onClick={()=>setCategoryId(elemnt.categoryId)}>join websocket id:{elemnt.categoryId}</button>
<div className="bg-sky-400" >prods:{
elemnt.prodsArr.map((elemntProd,prodIndex)=>{
return <div key={prodIndex}>
<p  className="bg-gray-500">{elemntProd}</p>
</div>
})
}</div>
</div>
})
    }</div>

<Link href={'/adminClient'}>
<button className="bg-" >go to user </button>
</Link>

</div>)

}