export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
      
      // Defaulting role to 'user' and robux to 0
      const insertQuery = 'INSERT INTO users (username, password_hash, is_banned, role, robux) VALUES ($1, $2, FALSE, $3, $4) RETURNING id';
      await pool.query(insertQuery, [username.trim(), password, 'user', 0]);
      
      return NextResponse.json({ success: true, message: "Account created successfully" });
    }

    // --- LOGIN LOGIC ---
    // Added 'role' and 'robux' to the query so the frontend receives them
    const queryText = 'SELECT id, username, password_hash, is_banned, role, robux FROM users WHERE username = $1 LIMIT 1';
    const dbResult = await pool.query(queryText, [username.trim()]);
    const user = dbResult.rows[0];

    // Check credentials
    if (!user || password !== user.password_hash) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    if (user.is_banned) {
      return NextResponse.json({ error: "Account banned." }, { status: 403 });
    }

    // Set the secure cookie for Server-Side Auth (used by Admin/Sidebar checks)
    const cookieStore = await cookies();
    cookieStore.set('userId', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Return user info for Client-Side (LocalStorage)
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        isBanned: user.is_banned,
        role: user.role,
        robux: user.robux
      } 
    });

  } catch (error) {
    console.error("AUTH ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
