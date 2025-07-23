'use client'
//socket.onmessage===receiving msg from websocketserver you connected 
//ws(socket)==> ws.send===send msg to websocket server 
import { useState } from "react";

export default function Create() {
    const [msg, setMsg] = useState('');
    const [room, setRoom] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [wsResponse, setWsResponse] = useState<string>('');
    const [availableRooms, setAvailableRooms] = useState<string[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);

    const join = () => {
        if (ws) return;
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            setWs(socket);
            console.log('✅ Connected to server');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // Handle different message types
            if (data.type === 'roomList') {
                setAvailableRooms(data.rooms);
                console.log('📋 Received room list:', data.rooms);
            } else if (data.type === 'message') {
                const messageText = `${data.msg}`;
                setMessages(prev => [...prev, messageText]);
                setWsResponse(`Room: ${data.room}, Message: ${data.msg}`);
            } else if (data.type === 'roomJoined') {
                setCurrentRoom(data.room);
                setRoom(data.room);
                setMessages([]); // Clear messages when joining new room
                console.log(`✅ Joined room: ${data.room}`);
            } else if (data.type === 'error') {
                alert(data.message);
                console.error('❌ Error:', data.message);
            }
        };

        socket.onclose = () => {
            setWs(null);
            setAvailableRooms([]);
            setCurrentRoom('');
            setMessages([]);
            console.log('❌ Disconnected');
        };
    };

    const sendMsg = () => {
        if (ws && msg) {
            if (!currentRoom) {
                alert('Please join a room first!');
                return;
            }
            ws.send(JSON.stringify({ type: 'message', msg }));
            setMsg(''); // Clear message after sending
        }
    };

    const joinExistingRoom = (roomName: string) => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'joinRoom', room: roomName }));
        }
    };

    const createAndJoinRoom = () => {
        if (ws && room) {
            ws.send(JSON.stringify({ type: 'joinRoom', room }));
            setRoom(''); // Clear input after joining
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={join}>Join WS</button>
            <p>Status: {ws ? "Connected" : "Disconnected"}</p>
            
            {/* Room Creation/Joining Section */}
            <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '10px' }}>
                <h3>Create or Join Room</h3>
                <input 
                    placeholder="New room name" 
                    value={room} 
                    onChange={(e) => setRoom(e.target.value)} 
                    style={{ margin: '5px', padding: '5px' }}
                />
                <button onClick={createAndJoinRoom} disabled={!room}>
                    Create & Join Room
                </button>
            </div>

            {/* Available Rooms Section */}
            {ws && (
                <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Available Rooms ({availableRooms.length})</h3>
                    {availableRooms.length === 0 ? (
                        <p>No rooms available. Create one by sending a message!</p>
                    ) : (
                        <div>
                            {availableRooms.map((roomName, index) => (
                                <button 
                                    key={index}
                                    onClick={() => joinExistingRoom(roomName)}
                                    style={{ 
                                        margin: '5px', 
                                        padding: '5px 10px',
                                        backgroundColor: currentRoom === roomName ? '#007bff' : '#f0f0f0',
                                        color: currentRoom === roomName ? 'white' : 'black',
                                        border: '1px solid #ccc',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📱 {roomName}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* Message Sending Section - Only show if in a room */}
            {currentRoom && (
                <div style={{ margin: '20px 0', border: '1px solid #007bff', padding: '10px' }}>
                    <h3>Chat in: {currentRoom}</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                        {messages.length === 0 ? (
                            <p style={{ color: '#999' }}>No messages yet...</p>
                        ) : (
                            messages.map((message, index) => (
                                <div key={index} style={{ margin: '5px 0' }}>
                                    {message}
                                </div>
                            ))
                        )}
                    </div>
                    <input 
                        placeholder="Type your message..." 
                        value={msg} 
                        onChange={(e) => setMsg(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
                        style={{ margin: '5px', padding: '5px', width: '70%' }}
                    />
                    <button onClick={sendMsg} disabled={!msg}>
                        Send Message
                    </button>
                </div>
            )}
            
            {/* Instructions if not in a room */}
            {!currentRoom && ws && (
                <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
                    <p>👆 Create a new room or select an existing room from above to start chatting!</p>
                </div>
            )}
            
            {/* Debug Info */}
            <div style={{ margin: '10px 0', fontSize: '12px', color: '#666' }}>
                <strong>Debug Info:</strong>
                <p>Current Room: {currentRoom || 'None'}</p>
                <p>Available Rooms: {availableRooms.length}</p>
                <p>Latest Response: {wsResponse}</p>
            </div>
        </div>
    );
}