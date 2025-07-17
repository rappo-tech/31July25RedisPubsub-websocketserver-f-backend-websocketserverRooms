import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
try{
const{msg}=await req.json()
//save to db 
const upperMsg=msg.toUpperCase()
return NextResponse.json(`msg from backend is ${upperMsg}`,{status:201})
}catch{
return NextResponse.json('try catch err ',{status:500})
}
 }
//wsBroswer-api-wesSocketServer-db====discord,whatapp,slack
//wsBroswer-websocketserver-Allclients-api+db===games,stockmarket,excelidraw