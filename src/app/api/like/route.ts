import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoption";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest) {
console.log('backend req came ')
    try{
const sesssion=await getServerSession(authOptions)
if(!sesssion){
return NextResponse.json('unauth',{status:404})
}
const body=await  req.json()
if(!body){
return NextResponse.json('cant find the body ',{status:404})
}
const {tweetName}=body
console.log(`tweetName${tweetName},tweetId `)
const findTweet = await prisma.allTweets.findFirst({
where:{tweetName}
})
if(!findTweet){
return NextResponse.json('cant find twet', {status:404})
}
await prisma.allTweets.update({
where:{id:findTweet.id}, 
data:{like:{
increment:1
}}
})

const tweetId=findTweet.id.toString()
const res=await fetch("http://localhost:8080/broadcast",{
method:'POST', 
headers:{'Content-type':"application/json"}, 
body:JSON.stringify({tweetId})
})
if(!res.ok){
return NextResponse.json('some err while sneding to websocket server  ',{status:404})
}

return NextResponse.json('like done ',{status:201})
    }catch{
return NextResponse.json('try catch  err ',{status:500})
    }
}