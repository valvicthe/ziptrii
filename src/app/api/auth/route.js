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

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    // 1. Fetch user by username
    const queryText = 'SELECT id, username, password_hash FROM users WHERE username = $1 LIMIT 1';
    const dbResult = await pool.query(queryText, [username.trim()]);
    
    const user = dbResult.rows[0];

    if (!user) {
      console.log("DEBUG: User not found:", username);
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    // 2. Comparison
    console.log("DEBUG: Attempting comparison for:", user.username);
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    console.log("DEBUG: Bcrypt result:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username } 
    });

  } catch (error) {
    console.error("DEBUG: CRITICAL AUTH ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
