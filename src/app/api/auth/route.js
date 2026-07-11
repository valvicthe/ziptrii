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

    // 2. Debug: Log if user was found
    if (!user) {
      console.log("DEBUG: Login attempt failed - User not found:", username);
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    // 3. Debug: Log the comparison
    console.log("DEBUG: User found:", user.username);
    console.log("DEBUG: Stored hash:", user.password_hash);
    console.log("DEBUG: Plaintext attempted:", password);

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    console.log("DEBUG: Bcrypt comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    // Success
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username } 
    });

  } catch (error) {
    console.error("DEBUG: CRITICAL AUTH ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}export const dynamic = 'force-dynamic';
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

    // 2. Debug: Log if user was found
    if (!user) {
      console.log("DEBUG: Login attempt failed - User not found:", username);
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    // 3. Debug: Log the comparison
    console.log("DEBUG: User found:", user.username);
    console.log("DEBUG: Stored hash:", user.password_hash);
    console.log("DEBUG: Plaintext attempted:", password);

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    console.log("DEBUG: Bcrypt comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    // Success
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username } 
    });

  } catch (error) {
    console.error("DEBUG: CRITICAL AUTH ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
