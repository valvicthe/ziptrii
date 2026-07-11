export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(request) {
  try {
    const { username, password, type } = await request.json();

    // --- SIGN UP LOGIC ---
    if (type === 'signup') {
      const checkExists = await pool.query('SELECT id FROM users WHERE username = $1', [username.trim()]);
      if (checkExists.rows.length > 0) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
      
      const insertQuery = 'INSERT INTO users (username, password_hash, is_banned) VALUES ($1, $2, FALSE) RETURNING id';
      await pool.query(insertQuery, [username.trim(), password]);
      return NextResponse.json({ success: true, message: "Account created successfully" });
    }

    // --- LOGIN LOGIC ---
    const queryText = 'SELECT id, username, password_hash, is_banned FROM users WHERE username = $1 LIMIT 1';
    const dbResult = await pool.query(queryText, [username.trim()]);
    const user = dbResult.rows[0];

    // Check credentials (Plaintext as requested)
    if (!user || password !== user.password_hash) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Return user info including ban status
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        isBanned: user.is_banned 
      } 
    });

  } catch (error) {
    console.error("AUTH ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
