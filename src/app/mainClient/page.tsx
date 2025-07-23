//websocket.onMessage=== is basiaclly  to recieve the data 

"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [groupId, setGroupId] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ userId: string; content: string }[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  const joinGroup = () => {
    if (!groupId.trim()) {
      console.error("Group ID is required");
      return;
    }
    const websocket = new WebSocket("ws://localhost:8080");
    setWs(websocket);

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      websocket.send(JSON.stringify({ action: "join", groupId }));
//websocket.send(JSON.stringify({type:"join",payload:{'roomId':"123"}}))

      console.log(`Joined group ${groupId}`);
      setIsJoined(true);
    };

    websocket.onmessage = (event) => {
      try {
        const { userId, content } = JSON.parse(event.data) as { userId: string; content: string };
        console.log(`Received: ${userId}: ${content}`);
        setMessages((prev) => [...prev, { userId, content }]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    websocket.onerror = (error) => console.error("WebSocket error:", error);
    websocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setIsJoined(false);
    };
  };

  const sendMessage = async () => {
    if (!input.trim() || !groupId.trim()) {
      console.error("Message and Group ID are required");
      return;
    }

    try {
      const res = await fetch("/api/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, userId: "u1", content: input }),
      });
      const data = await res.json();
      console.log("Message sent:", data);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    return () => ws?.close(); // Cleanup on unmount
  }, [ws]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Group Chat</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="Enter Group ID (e.g., g2)"
          style={{ flex: 1, padding: "8px" }}
          disabled={isJoined}
        />
        <button
          onClick={joinGroup}
          disabled={isJoined}
          style={{ padding: "8px 16px", opacity: isJoined ? 0.5 : 1 }}
        >
          Join
        </button>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "5px 0" }}>
            <strong>{msg.userId}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px" }}
          disabled={!isJoined}
        />
        <button
          onClick={sendMessage}
          disabled={!isJoined}
          style={{ padding: "8px 16px", opacity: isJoined ? 1 : 0.5 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}