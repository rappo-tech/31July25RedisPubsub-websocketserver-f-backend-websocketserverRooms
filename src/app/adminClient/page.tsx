'use client'
import axios from "axios"
import { useState } from "react"
import Link from "next/link"




export interface typeAllTweets{
id:string,
tweetName:string,
like:number
}


export  default  function AdminClient() {
    const[tweetName,setTweetName]=useState<string>('')
    const[status,setStatus]=useState<string>('')
    const[allTweets,setAllTweets]=useState<typeAllTweets[]>([])
    const[activeTweet,setActiveTweet]=useState<string>('')

const  createTweet=async ()=>{
try{
const response=await axios.post('/api/createTweets',{tweetName},{headers:{'Content-Type':'application/json'},withCredentials:true})
if(response.status===201){
setTweetName('')
} 
}catch{
return setStatus('try catch   err ')
}
}

 const getTweets=async()=>{
try{
const response=await axios.get('/api/getTweets')
if(response.status===201){
setAllTweets(response.data)
}
}catch{
setStatus('try catch err tweets ')
}
}
const likeTweet=async()=>{
try{
const response=await axios.post('/api/like',{tweetName:activeTweet},{headers:{'Content-Type':"application/json"},withCredentials:true})
if(response.status===201){
setStatus(response.data)
}
}catch{
setStatus('try catch err')
}
}

return (<div>

<input
type="text"
placeholder="enter tweet name "
value={tweetName}
onChange={(e)=>setTweetName(e.target.value)}
/>
<button  className="bg-pink-500" onClick={createTweet}>post tweet</button>



<button  className="bg-red-500" onClick={getTweets}>get tweet</button>
<div>{
allTweets.map((element,index)=>{
return <div key={index}>
<p>{element.tweetName}</p>
<button className="bg-green-700 hover:bg-amber-100" >{element.id}</button>
<p>{element.like}</p>
<button onClick={()=>{
setActiveTweet(element.tweetName)
}}>set active </button>
{activeTweet===element.tweetName &&
<button className="bg-pink-800" onClick={likeTweet}>like </button>
}
</div>
})
    }</div>


<p>warning :{status}</p>

<Link href={'/userClient'}>
<button className="bg-blue-950 hover:bg-sky-400">go to user </button>
</Link>


</div>)
}





