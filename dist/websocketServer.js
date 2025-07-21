import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket server started on port 8080');
// Store clients by category (rooms)
const categoryRooms = {};
wss.on('connection', (socket) => {
    console.log('New client connected');
    let currentCategory = null;
    socket.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            // Handle joining a category room
            if (message.action === 'join') {
                const { catogry } = message;
                // Remove from previous category if exists
                if (currentCategory && categoryRooms[currentCategory]) {
                    categoryRooms[currentCategory].delete(socket);
                }
                // Add to new category
                if (!categoryRooms[catogry]) {
                    categoryRooms[catogry] = new Set();
                }
                categoryRooms[catogry].add(socket);
                currentCategory = catogry;
                console.log(`Client joined category: ${catogry}`);
                socket.send(JSON.stringify({
                    type: 'joined',
                    catogry: catogry,
                    message: `Joined category: ${catogry}`
                }));
                return;
            }
            // Handle broadcasting message to category (auto-join if not in room)
            if (message.catogry && message.prodName) {
                const { catogry, prodName } = message;
                console.log(`Broadcasting to category ${catogry}: ${prodName}`);
                // Auto-create category room if it doesn't exist
                if (!categoryRooms[catogry]) {
                    categoryRooms[catogry] = new Set();
                    console.log(`Created new category room: ${catogry}`);
                }
                // Send to all clients in this category
                categoryRooms[catogry].forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'message',
                            catogry: catogry,
                            prodName: prodName.toUpperCase(),
                            timestamp: new Date().toISOString()
                        }));
                    }
                });
                console.log(`Sent to ${categoryRooms[catogry].size} clients in ${catogry}`);
            }
        }
        catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    socket.on('close', () => {
        // Remove from current category
        if (currentCategory && categoryRooms[currentCategory]) {
            categoryRooms[currentCategory].delete(socket);
            console.log(`Client left category: ${currentCategory}`);
        }
        console.log('Client disconnected');
    });
    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
