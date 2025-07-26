import { WebSocketServer, WebSocket } from "ws";
import http from 'http';
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === "/broadcast") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            const { prodName, groupId } = JSON.parse(body);
            console.log(`1. prodNmae : ${prodName},groupId:${groupId}`);
            // input receive the send response 
            allGroups[groupId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ capitalResponse: prodName.toUpperCase() })); // output send msg to browser 
                    console.log(`2.send the prodName `);
                }
            });
        });
    }
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify({ success: true }));
});
const wss = new WebSocketServer({ server });
const allGroups = {};
wss.on('connection', (socket) => {
    socket.on('message', (data) => {
        const { action, groupId } = JSON.parse(data);
        console.log(`3.${action},groupId: ${groupId}`);
        if (action === 'join') {
            if (!allGroups[groupId]) {
                allGroups[groupId] = new Set(); //creat a group 
            }
            allGroups[groupId].add(socket); //join wsocket with broswer
            console.log(`4.joined websocket `);
        }
    });
    socket.on("close", () => {
        for (const groupId in allGroups) {
            allGroups[groupId].delete(socket);
            if (allGroups[groupId].size === 0)
                delete allGroups[groupId];
            console.log(`Client left group ${groupId}`);
        }
        console.log("Client disconnected");
    });
    socket.on("error", (error) => console.error("WebSocket error:", error));
});
server.listen({ port: 8080 }, () => console.log('websocket server started '));
