import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoption";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest) {
console.log('1.backend  req  came ')
    try{
const session=await getServerSession(authOptions)
if(!session){
return NextResponse.json('un auth ',{status:404})
}
const body=await req.json()
console.log(`body: ${body}`)
if(!body){
return NextResponse.json('cant find body ',{status:405})
}
const {categoryName}=body
console.log(`3.${categoryName}`)
const response=await prisma.clothCategory.create({
data:{categoryName},
select:{id:true}
})
console.log('creation done ')
return NextResponse.json(response,{status:201})
    }catch{
return NextResponse.json('try catch err ',{status:500})
    }
}