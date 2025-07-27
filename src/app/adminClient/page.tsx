'use client'

import { useUser } from "../../../zustandStore/useUser"
import { useCallback, useState } from "react"
import axios from "axios"
import Link from "next/link"


export default function Admin() {
const[clothName,setClothName]=useState<string>('') 
const[categoryName,setCatogryName]=useState<string>('')
const[status,setStatus]=useState<string>('')
const {setStore}=useUser()
const[categoryId,setCategoryId]=useState<string>('')

const sendCategoryName=useCallback(async()=>{
try{
const response=await axios.post('/api/createCatogry',{categoryName},{headers:{'Content-Type':"application/json"},withCredentials:true})
if(response.status===201){
setStore({categoryName:categoryName})
setCategoryId(response.data.id)
}
}catch{
setStatus('err while creating catogry ')
}
},[categoryName,setStore])


const sendProdName=useCallback(async()=>{
try{
const response=await axios.post('/api/createCloths',{categoryId,clothName,categoryName},{headers:{'Content-Type':"application/json"},withCredentials:true})
if(response.status===201){
setClothName('')
setStatus(response.data)
}
}catch{
setStatus('try catch err ')
}
},[categoryId,clothName,categoryName])

return (<div>

<input
type="text"
placeholder="enter your category"
value={categoryName}
onChange={(e)=>setCatogryName(e.target.value)}
/>
<button className="bg-green-700" onClick={sendCategoryName}>setCatogryName</button>



<input
type="text"
placeholder="enter your clothname "
value={clothName}
onChange={(e)=>setClothName(e.target.value)}
/>

<button className="bg-green-700" onClick={sendProdName}>setclothname</button>


<p>status: {status}</p>
<p>created catogryId:{categoryId}</p>


<Link href={'/userClient'}>
<button className="bg-violet-500">go to user </button>
</Link>


</div>)
}







