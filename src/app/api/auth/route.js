import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({ success: true, message: "Authenticated." });
}

export async function GET() {
  return NextResponse.json({ id: 1, name: "Ziptrii", displayName: "Ziptrii" });
}
