import http from 'http';
import { WebSocketServer } from 'ws';
const server = http.createServer((req, res) => {
    if (req.url === '/broadcast' && req.method === 'POST') {
        let body = "";
        req.on("data", (chunk) => body += chunk);
        req.on('end', () => {
            const { categoryId, clothName } = JSON.parse(body);
            allCatogry[categoryId]?.forEach((clinet) => {
                clinet.send(JSON.stringify({ capital: clothName.toUpperCase() }));
            });
        });
    }
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify({ success: true }));
});
const wss = new WebSocketServer({ server });
const allCatogry = {};
wss.on('connection', (socket) => {
    socket.on('message', (data) => {
        const parsedData = JSON.parse(data);
        const { action, categoryId } = parsedData;
        if (action === 'JOIN') {
            if (!allCatogry[categoryId]) {
                allCatogry[categoryId] = new Set();
            }
            allCatogry[categoryId].add(socket);
            console.log(allCatogry[categoryId].size);
            allCatogry[categoryId].forEach((client) => {
                client.send(JSON.stringify({ totalUsers: allCatogry[categoryId].size }));
            });
        }
    });
    socket.on("close", () => {
        for (const categoryId in allCatogry) {
            allCatogry[categoryId].delete(socket);
            if (allCatogry[categoryId].size === 0)
                delete allCatogry[categoryId];
            console.log(`Client left group ${categoryId}`);
        }
        console.log("Client disconnected");
    });
    socket.on("error", (error) => console.error("WebSocket error:", error));
});
server.listen(8080, () => console.log('websocket server started at port 8080'));
