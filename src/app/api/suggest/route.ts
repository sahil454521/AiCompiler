import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    const res = await fetch("https://ml-code-suggestion-api.onrender.com/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const { suggestion } = await res.json();

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("ML Suggestion API error:", error);
    return NextResponse.json(
      { error: "ML Suggestion API failed." },
      { status: 500 }
    );
  }
}