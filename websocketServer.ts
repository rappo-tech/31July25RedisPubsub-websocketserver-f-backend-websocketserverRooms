import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Redis from 'ioredis';




// Initialize Redis subscriber with error handling
const redisSub = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 500, 3000),
});

// Handle Redis connection errors
redisSub.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redisSub.on('connect', () => {
  console.log('Connected to Redis');
});

// Store clients by categoryId
const allCategory: Record<string, Set<WebSocket>> = {};


// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true }));
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (socket: WebSocket) => {
  console.log('Client connected');

  socket.on('message', async (data: string) => {
    try {
      const msg = JSON.parse(data);
      const { action, categoryId } = msg as { action: string; categoryId: string };
      console.log(`Received: action=${action}, categoryId=${categoryId}`);

      if (action === 'join') {
        // Add client to category room
        if (!allCategory[categoryId]) {
          allCategory[categoryId] = new Set();

//after  backend next/js api.ts 
          await redisSub.subscribe(categoryId, (err, count) => {
            if (err) {
              console.error(`Failed to subscribe to ${categoryId}:`, err);
            } else {
              console.log(`Subscribed to Redis channel ${categoryId}, count: ${count}`);
            }
          });
        }
        allCategory[categoryId].add(socket);
        console.log(`Client joined category ${categoryId}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  socket.on('close', () => {
    // Remove client from all categories
    for (const categoryId in allCategory) {
      allCategory[categoryId].delete(socket);
      if (allCategory[categoryId].size === 0) {
        // Unsubscribe from Redis channel if no clients remain
        redisSub.unsubscribe(categoryId, (err,) => {
          if (err) {
            console.error(`Failed to unsubscribe from ${categoryId}:`, err);
          } else {
            console.log(`Unsubscribed from Redis channel ${categoryId}`);
          }
        });
        delete allCategory[categoryId];
        console.log(`Category ${categoryId} removed (no clients)`);
      }
    }
    console.log('Client disconnected');
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});


//when in  api/route.ts  redis.publish(categoryId) but send msg:and via REST api  
redisSub.on('message', (channel: string, message: string) => {
  console.log(`Received message on channel ${channel}: ${message}`);
  try {
    const { ans } = JSON.parse(message);
    const clients = allCategory[channel];
    if (clients) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ capital: ans.toUpperCase() }));
        }
      });
    }
  } catch (error) {
    console.error('Error processing Redis message:', error);
  }
});

// Start server
server.listen(8080, () => {
  console.log('WebSocket server started at port: 8080');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down WebSocket server...');
  redisSub.quit();
  server.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});








/*
import http from 'http'
import { WebSocketServer,WebSocket } from 'ws'
const server=http.createServer((req,res)=>{
let body=""; 
if(req.method==='POST' && req.url==='/broadcast'){
req.on('data',(chunk)=>body+=chunk)
req.on('end',()=>{
const {categoryId,ans }=JSON.parse(body)as{categoryId:string,ans:string }
//const {categoryId,ans}=parsedBody as{categoryId:string,ans:string }
console.log(`cId${categoryId},  ans ${ans }`)
allCatogry?.[categoryId].forEach((client)=>{
if(client.readyState===WebSocket.OPEN){
client.send(JSON.stringify({capital:ans.toUpperCase()}))
}
})
})
}
res.writeHead(200,{"Content-type":"application/json"})
res.end(JSON.stringify({success:true}))


})
const wss=new WebSocketServer({server})
const allCatogry: Record<string, Set<WebSocket>> = {};
wss.on('connection',(socket:WebSocket)=>{
socket.on('message',(data:string)=>{
const msg=JSON.parse(data) 
const {action,categoryId}=msg as{action:string,categoryId:string}
console.log(`cId:${categoryId}`)
if(action==='join'){
if(!allCatogry[categoryId]){
allCatogry[categoryId]=new Set()
}
allCatogry[categoryId].add(socket)
}
})
socket.on("close", () => {
    for (const categoryId in allCatogry) {
      allCatogry[categoryId].delete(socket);
      if (allCatogry[categoryId].size === 0) delete allCatogry[categoryId];
      console.log(`Client left group ${categoryId}`);
    }
    console.log("Client disconnected");
  });

  socket.on("error", (error) => console.error("WebSocket error:", error));

})
server.listen(8080,()=>console.log('websocket server starts at port:8080'))
*/