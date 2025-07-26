import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
export async function POST(req:NextRequest) {
console.log(`1.backend req came `)
try{
const body =await req.json()
const{adminName}=body
console.log(`2.body${body}`)
await prisma.allAdmins.create({
data:{adminName}
})
console.log(`3.created sucesfully `)
return NextResponse.json('created sucessfully ',{status:201})
}catch{
return NextResponse.json('try catch  err ',{status:500})
}
}