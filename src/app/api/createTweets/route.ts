import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoption"
import prisma from "../../../../lib/prisma";

export async function POST(req:NextRequest) {
console.log ('bceknd req  came ')
    try{
const session=await getServerSession(authOptions)
if(!session){
return NextResponse.json('un auth ',{status:404})
}
const body=await req.json()
if(!body){
return NextResponse.json('cant  find body ',{status:404})
}
const {tweetName}=  body
console.log(`2.tweetName:${tweetName}`)
const response=await prisma.allTweets.create({
data:{tweetName,like:0}, 
select:{id:true}
})
console.log('3. done ')
return NextResponse.json(response.id,{status:201})
    }catch{
return NextResponse.json('try catch err ',{status:500})
    }
}