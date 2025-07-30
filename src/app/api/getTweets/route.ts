import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
console.log('backend req came ')
    try{
const all=await prisma.allTweets.findMany()
console.log(all)
return NextResponse.json(all,{status:201})
    }catch{
return NextResponse.json('try catch err ',{status:500})
    }
}