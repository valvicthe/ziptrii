import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Setup connection pool handling both combined URL string or separate variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    // 1. Double check query syntax matching your table structure
    // IMPORTANT: If your columns are named differently, change them here!
    const queryText = 'SELECT id, username, password FROM users WHERE username = $1 LIMIT 1';
    
    let dbResult;
    try {
      dbResult = await pool.query(queryText, [username.trim()]);
    } catch (dbErr) {
      console.error("❌ CRITICAL DATABASE QUERY ERROR:", dbErr.message);
      return NextResponse.json({ error: "nga server died idk what happend @grok what happend help me" }, { status: 500 });
    }
    
    const user = dbResult.rows[0];

    // Username not found
    if (!user) {
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    // 2. Cryptographic check against the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    // Success!
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error("❌ GLOBAL AUTH ROUTE CRASH:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
