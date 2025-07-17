import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
console.log('websoket server port started 8080');
wss.on('connection', (socket) => {
    console.log('2 clinet is added ');
    socket.on('message', (msg) => {
        const incomingMsg = msg.toString();
        console.log(`3 ${incomingMsg}`);
        const resposneMsg = incomingMsg.toUpperCase();
        console.log(`4 ${resposneMsg}`);
        socket.send(resposneMsg);
    });
    socket.on('error', () => {
        console.log('5. err while socket ');
    });
});
