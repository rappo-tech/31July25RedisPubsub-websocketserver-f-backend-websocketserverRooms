'use client'
import { useState } from "react";

export default function Create() {
    const [msg, setMsg] = useState('');
    const [room, setRoom] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [wsResponse, setWsResponse] = useState<string>('');

    const join = () => {
        if (ws) return;
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            setWs(socket);
            console.log('✅ Connected to server');
        };
        socket.onmessage = (event) => {
            const { room, msg } = JSON.parse(event.data);
            setWsResponse(`Room: ${room}, Message: ${msg}`);
        };
        socket.onclose = () => {
            setWs(null);
            console.log('❌ Disconnected');
        };
    };

    const sendMsg = () => {
        if (ws && msg && room) {
            ws.send(JSON.stringify({ room, msg }));
        }
    };

    return (
        <div>
            <button onClick={join}>Join WS</button>
            <p>Status: {ws ? "Connected" : "Disconnected"}</p>

            <input 
                placeholder="Room name" 
                value={room} 
                onChange={(e) => setRoom(e.target.value)} 
            />
            <input 
                placeholder="Message" 
                value={msg} 
                onChange={(e) => setMsg(e.target.value)} 
            />

            <button onClick={sendMsg}>Send Msg</button>

            <p>Response: {wsResponse}</p>
        </div>
    );
}
