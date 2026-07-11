export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Query specifically for 'password_hash'
    const queryText = 'SELECT id, username, password_hash FROM users WHERE username = $1 LIMIT 1';
    const dbResult = await pool.query(queryText, [username.trim()]);
    
    const user = dbResult.rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Compare against 'user.password_hash' instead of 'user.password'
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username } 
    });

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
