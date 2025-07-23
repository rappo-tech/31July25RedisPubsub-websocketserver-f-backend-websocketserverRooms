import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { groupId, userId, content } = await req.json() as {
      groupId: string;
      userId: string;
      content: string;
    };
    
    const res = await fetch("http://localhost:8080/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, userId, content }),
    });
    console.log(`Forwarded message to WebSocket server: ${groupId}: ${userId}: ${content}`);

    if (!res.ok) {
      throw new Error("Failed to forward message to WebSocket server");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}