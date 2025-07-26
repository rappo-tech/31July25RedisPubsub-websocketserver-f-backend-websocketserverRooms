//socket.on('message')=req.json()===input
//socket.send('msg')= req.json()====output
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/broadcast") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { groupId, userId, content } = JSON.parse(body) as {
          groupId: string;
          userId: string;
          content: string;
        };
        console.log(`Received message for group ${groupId}: ${userId}: ${content}`);
          const capitalizedContent = content.toUpperCase();
        rooms[groupId]?.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ userId, content:capitalizedContent }));
          }
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error("Error processing broadcast:", error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to process message" }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});





const wss = new WebSocketServer({ server });
const rooms: Record<string, Set<WebSocket>> = {};


wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (data: string) => {
    try {
      const { action, groupId } = JSON.parse(data) as { action: string; groupId: string };
      if (action === "join") { 
        if (!rooms[groupId]) rooms[groupId] = new Set();
        rooms[groupId].add(ws);
        console.log(`Client joined group ${groupId}`);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    for (const groupId in rooms) {
      rooms[groupId].delete(ws);
      if (rooms[groupId].size === 0) delete rooms[groupId];
      console.log(`Client left group ${groupId}`);
    }
    console.log("Client disconnected");
  });

  ws.on("error", (error) => console.error("WebSocket error:", error));
});

server.listen(8080, () => console.log("WebSocket server running on ws://localhost:8080"));