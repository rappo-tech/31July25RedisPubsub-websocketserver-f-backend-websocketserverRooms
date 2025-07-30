import http from 'http'
import { WebSocketServer,WebSocket } from 'ws'
import prisma from './lib/prisma.js';

const server=http.createServer((req,res)=>{
let body="";
if(req.method==='POST'&&req.url==='/broadcast'){
req.on('data',(chunk)=>body+=chunk)
req.on('end',async()=>{
const {tweetId}=JSON.parse(body) as {tweetId:string,prodName:string}
console.log(tweetId)
const allTweets=await prisma.allTweets.findMany()
allCategory?.[tweetId].forEach((client)=>{
if(client.readyState===WebSocket.OPEN){
client.send(JSON.stringify({capital:tweetId.toUpperCase(),all:allTweets}))
}
})
})
res.writeHead(200,{"Content-type":"application/json"})
res.end(JSON.stringify({success:true}))

}
})

const wss= new WebSocketServer({server})
const  allCategory: Record<string, Set<WebSocket>> = {};
wss.on('connection',(socket:WebSocket)=>{
socket.on('message',(data:string)=>{
const parseData=JSON.parse(data) 
const {action,tweetId}= parseData as {action:string,tweetId:string}
if(action==='join'){
if(!allCategory[tweetId]){
allCategory[tweetId]=new Set()
}
allCategory[tweetId].add(socket)
}
})
 socket.on("close", () => {
    for (const tweetId in allCategory) {
      allCategory[tweetId].delete(socket);
      if (allCategory[tweetId].size === 0) delete allCategory[tweetId];
      console.log(`Client left group ${tweetId}`);
    }
    console.log("Client disconnected");
  });

  socket.on("error", (error) => console.error("WebSocket error:", error));

})

server.listen(8080,()=>console.log('websocket server start at port 8080'))