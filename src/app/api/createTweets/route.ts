import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.categoryId || !body.ans) {
      return NextResponse.json({ error: 'Missing categoryId or ans' }, { status: 400 });
    }
    const { categoryId, ans } = body;

    const redisResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/publish/${categoryId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ans }),
      }
    );

    if (!redisResponse.ok) {
      console.error('Failed to publish to Redis:', await redisResponse.text());
      return NextResponse.json({ error: 'Failed to publish to Redis' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Answer created and published' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /create:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
  }
}













/*
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
try{
const body=await req.json()
if(!body){
return NextResponse.json('cant find the body ',{status:404})
}
const{categoryId,ans}=body
//save ans to prisma and add this to queue 
const res=await fetch("http://localhost:8080/broadcast",{
method:"POST", 
headers:{"Content-type":"application/json"}, 
body:JSON.stringify({categoryId,ans})
})
if(!res.ok){
return NextResponse.json('websocket server not responed ',{status:404})
}
return NextResponse.json('done creatig ans  ',{status:201})
}catch{
return NextResponse.json('try catch  err',{status:500})
}
}
*/