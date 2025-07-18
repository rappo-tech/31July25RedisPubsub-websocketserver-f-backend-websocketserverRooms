import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket server running on port 8080 for rooms ');
const rooms = {}; // ✅ Room registry
wss.on('connection', (socket) => {
    console.log('✅ Client connected');
    socket.on('message', (data) => {
        const { room, msg } = JSON.parse(data.toString());
        // ✅ Step 1: Join room if not already
        if (!rooms[room]) {
            rooms[room] = new Set();
        }
        rooms[room].add(socket);
        console.log(`✅ Message from ${room}: ${msg}`);
        // ✅ Step 2: Broadcast to that room
        rooms[room].forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ room, msg: msg.toUpperCase() }));
            }
        });
        console.log(`total no  of clients in this  room :${rooms[room].size}`);
        console.log(`total no of  clinet : ${wss.clients.size}`);
        console.log(`total no of rooms :${Object.keys(rooms).length} `);
    });
    socket.on('close', () => {
        console.log('❌ Client disconnected');
        // ✅ Step 3: Remove socket from all rooms
        for (const room in rooms) {
            rooms[room].delete(socket);
        }
    });
});
