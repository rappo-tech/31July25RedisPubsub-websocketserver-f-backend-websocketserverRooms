/*
//socket.on('message')=req.json()===input ,28:02
//socket.send('msg')= req.json()====output
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket server running on port 8080 for rooms ');

const rooms: Record<string, Set<WebSocket>> = {}; // Room registry
const roomHistory: Set<string> = new Set(); //  Keep track of all created rooms
const clientRooms: Map<WebSocket, string> = new Map(); // Track which room each client is in

// Function to send room list to a specific client
const sendRoomList = (socket: WebSocket) => {
    const roomList = Array.from(roomHistory); // Use roomHistory instead of Object.keys(rooms)
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ // send===res 
            type: 'roomList', 
            rooms: roomList 
        }));
    }
};

// Function to broadcast room list to all clients
const broadcastRoomList = () => {
    const roomList = Array.from(roomHistory); // Use roomHistory instead of Object.keys(rooms)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ //send== res 
                type: 'roomList', 
                rooms: roomList 
            }));
        }
    });
};

wss.on('connection', (socket: WebSocket) => {
    console.log('✅ Client connected');
    
    // Send current room list to the newly connected client
    sendRoomList(socket);
    //socket.on('message')=req.json()===input 
    //socket.send('msg')= req.json()====output
    socket.on('message', (data: string | Buffer) => {
        const parsedData = JSON.parse(data.toString());
        
        if (parsedData.type === 'joinRoom') {
            // Handle room joining
            const { room } = parsedData;
            
            // Remove client from previous room if they were in one
            const previousRoom = clientRooms.get(socket);
            if (previousRoom && rooms[previousRoom]) {
                rooms[previousRoom].delete(socket);
                // DON'T delete empty rooms anymore - keep them in roomHistory
            }
            
            // Add client to new room
            const isNewRoom = !roomHistory.has(room);
            if (!rooms[room]) {
                rooms[room] = new Set();
            }
            rooms[room].add(socket);
            clientRooms.set(socket, room);
            
            // Add room to history (permanent record)
            roomHistory.add(room);
            
            console.log(`✅ Client joined room: ${room}`);
            
            // Send confirmation to client
            socket.send(JSON.stringify({// send===res 
                type: 'roomJoined',
                room: room
            }));
            
            // If it's a new room, broadcast updated room list to all clients
            if (isNewRoom) {
                broadcastRoomList();
            }
            
        } else if (parsedData.type === 'message') {
            // Handle message sending
            const { msg } = parsedData;
            const currentRoom = clientRooms.get(socket);
            
            if (!currentRoom) {
                // Client is not in any room
                socket.send(JSON.stringify({
                    type: 'error',
                    message: 'You must join a room first to send messages'
                }));
                return;
            }
            
            console.log(`✅ Message from ${currentRoom}: ${msg}`);
            
            // ✅ Broadcast only to clients in the same room
            if (rooms[currentRoom]) {
                rooms[currentRoom].forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ 
                            type: 'message',
                            room: currentRoom, 
                            msg: msg.toUpperCase() 
                        }));
                    }
                });
            }
        }
        
        console.log(`total no of clients: ${wss.clients.size}`);
        console.log(`total no of active rooms: ${Object.keys(rooms).length}`);
        console.log(`total no of created rooms: ${roomHistory.size}`);
    });
    
    socket.on('close', () => {
        console.log('❌ Client disconnected');
        
        // ✅ Remove socket from current room but DON'T delete the room
        const currentRoom = clientRooms.get(socket);
        if (currentRoom && rooms[currentRoom]) {
            rooms[currentRoom].delete(socket);
            
            // Don't delete empty rooms - they stay in roomHistory for rejoining
            if (rooms[currentRoom].size === 0) {
                console.log(`Room ${currentRoom} is now empty but preserved for rejoining`);
            }
        }
        
        // Remove from client tracking
        clientRooms.delete(socket);
        
        // Don't need to broadcast room list since rooms persist
        console.log(`Active rooms: ${Object.keys(rooms).length}, Total created: ${roomHistory.size}`);
    });
});
*/
