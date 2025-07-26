'use client'

import { useState } from "react"
import axios from "axios"
import { useUser } from "../../../zustandStore/useUser"
import Link from "next/link"

export default  function AdminClinet() {
const[adminName,setAdminName]=useState<string>('')
const[status,setStatus]=useState<string>('')
const[categoryName,setCategoryName]=useState<string>('')
const[prodName,setProdName]=useState<string>('')
const {setStore,store}=useUser()
const[categoryId,setCategoryId]=useState<string>('')


const createAdmin=async()=>{
    try{
const response=await axios.post('/api/createAdmin',{adminName},{headers:{'Content-Type':'application/json'}})
if(response.status===201){
setStore({adminName:adminName,categoryName:''})
setStatus(response.data)
setAdminName('')
}
}catch{
setStatus('try catch errr ')
    }
}

const createCategory=async()=>{
try{
const response=await axios.post('/api/createCatogry',{categoryName,adminName:store?.adminName},{headers:{'Content-Type':"application/json"}})
if(response.status===201){
setStore({adminName:adminName,categoryName:categoryName})
setCategoryId(response.data.id)
}
}catch{
setStatus('try catch err ')
}
}
const createproduct=async()=>{
try{
const response=await axios.post('/api/createProds',{categoryName:store?.categoryName,prodName},{headers:{'Content-Type':"application-json"}})
if(response.status===201){
setProdName('')
}
}catch{
setStatus('try catch  err ')
}
}





return(<div>

<input
type="text"
placeholder="enter your adminname "
value={adminName}
onChange={(e)=>setAdminName(e.target.value)}
/>
<button className="bg-green-600"  onClick={createAdmin}>send admins </button>

<input
type="text"
placeholder="enter your catogrynmae "
value={categoryName}
onChange={(e)=>setCategoryName(e.target.value)}
/>
<button className="bg-red-600"  onClick={createCategory}>create category </button>
<button className="bg-amber-300">Cat id:{categoryId}</button>

<input
type="text"
placeholder="enter your prodname "
value={prodName}
onChange={(e)=>setProdName(e.target.value)}
/>
<button className="bg-yellow-600"  onClick={createproduct}>create prod </button>

<p>status:{status}</p>
<p className="bg-teal-600" >store adminName : {store?.adminName}</p>
<p className="bg-teal-600" >store actogryName : {store?.categoryName}</p>

<Link href={'/userClient'}>
<button className="bg-pink-600">go to user </button>
</Link>



</div>)
}