import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req:NextRequest) {
console.log(`1.craete prod  backend req came `)
try{
const body=await req.json()
if(!body){
return NextResponse.json('cant find body',{status:404})
}
const {categoryName,prodName}=body
console.log(`2.category:${categoryName} and prod"${prodName}`)
const findCategory=await prisma.allCategory.findFirst({
where:{categoryName}
})
if(!findCategory){
console.log(`cant find catogry`)
return NextResponse.json('cant find catogry',{status:404})
}
await prisma.allProds.create({
data:{categoryId:findCategory.id,prodName}
})
console.log(`3.prodnam creatin is done `)

//redis publish(websocketserver)
//send prodName and catogryId  to websocketserver
const sendDataTowsserver=await fetch("http://localhost:8080/broadcast",{
method:'POST',
headers:{'Content-type':"application/json"}, 
body:JSON.stringify({prodName:prodName,groupId:findCategory.id})
})
if(!sendDataTowsserver.ok){
return NextResponse.json('websocket server issue ',{status:404})
}


return NextResponse.json('prod created sucessfully ',{status:201})
}catch{
return NextResponse.json('try catch  err ',{status:500})
}
}