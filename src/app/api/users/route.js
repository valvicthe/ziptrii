import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({
    id: 1,
    name: "Ziptrii",
    displayName: "Ziptrii",
    description: "67",
    created: new Date().toISOString()
  });
}
