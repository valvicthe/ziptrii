export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Log that the request was received
    console.log("DEBUG: Auth request received");

    // Check if variables exist at all
    if (!process.env.DATABASE_URL) {
      console.error("DEBUG: DATABASE_URL is missing from environment variables!");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const { username, password } = await request.json();
    console.log("DEBUG: Attempting login for user:", username);

    const queryText = 'SELECT id, username, password FROM users WHERE username = $1 LIMIT 1';
    const dbResult = await pool.query(queryText, [username.trim()]);
    
    // Close the pool after query
    await pool.end();

    const user = dbResult.rows[0];

    if (!user) {
      console.log("DEBUG: User not found in database");
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("DEBUG: Password mismatch");
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });

  } catch (error) {
    // This will print the actual crash message to your Railway console
    console.error("DEBUG: CRITICAL CRASH:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
