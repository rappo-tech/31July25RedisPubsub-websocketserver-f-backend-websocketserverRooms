import { NextRequest, NextResponse } from "next/server";
import {WebSocket} from "ws";

export async function POST(req:NextRequest) {
  console.log('backend req came ')
  try{
    const body = await req.json()
    const {catogry, prodName} = body
    console.log(`2.catogry:${catogry} and prod ${prodName}`)
    
    const wss = new WebSocket('ws://localhost:8080')
    
    return new Promise((resolve) => {
      wss.on('open', () => {
        wss.send(JSON.stringify({catogry, prodName}))
        console.log('3. Message sent to WebSocket')
        wss.close()
        resolve(NextResponse.json(`successfully updated the websocket`, {status: 201}))
      })
      
      wss.on('error', (error) => {
        console.error('WebSocket error:', error)
        resolve(NextResponse.json('WebSocket connection error', {status: 500}))
      })
    })
    
  } catch(error) {
    console.error('API error:', error)
    return NextResponse.json('try catch err ', {status: 500})
  }
}