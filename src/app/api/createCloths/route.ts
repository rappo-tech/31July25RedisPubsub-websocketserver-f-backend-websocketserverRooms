import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoption";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
console.log ('baceknd req came ')
    try{
const sesssion=await getServerSession(authOptions)
if(!sesssion){
return NextResponse.json('un auth',{status:403})
}
const body=await req.json()
if(!body){
return NextResponse.json('cant find body',{status:404})
}
const{categoryId,clothName,categoryName}= body 
console.log(`CatogryId :${categoryId},catogeyName:${categoryName},clothName:${clothName}, `)
const findcatogry=await prisma.clothCategory.findFirst({
where:{categoryName}
})
if(!findcatogry){
console.log(`cant find catogry `)
return NextResponse.json('cant find ctogry ',{status:404})
}
await prisma.allCloths.create({
data:{clothName,categoryId:categoryId}
})
console.log(`cloth created `)

const res=await fetch("http://localhost:8080/broadcast",{
method:"POST", 
headers:{'Content-type':"application/json"},
body:JSON.stringify({categoryId,clothName})
})

console.log(`send  to websocket `)
if(!res.ok){
return NextResponse.json('websocket have issue ',{status:404})
}
return NextResponse.json('createing clothanme done ',{status:201})
    }catch{
return NextResponse.json('try catch err ',{status:500})
    }
}