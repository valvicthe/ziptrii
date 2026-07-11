import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ziptrii_fallback_security_key';

// GET /v1/users/authenticated
export async function GET(request) {
  try {
    // Replicate .ROBLOSECURITY cookie verification
    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader.split('; ').find(row => row.startsWith('.ROBLOSECURITY='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch fresh user metadata from PostgreSQL
    const userRes = await query('SELECT id, username, display_name, role FROM users WHERE id = $1', [decoded.id]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = userRes.rows[0];
    return NextResponse.json({
      id: user.id,
      name: user.username,
      displayName: user.display_name,
      role: user.role
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// POST Handler for both signup and login actions
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, username, displayName, password } = body;

    // --- SIGNUP LOGIC ---
    if (action === 'signup') {
      if (!username || !password || !displayName) {
        return NextResponse.json({ error: 'Missing required validation criteria.' }, { status: 400 });
      }

      // Check if username already exists
      const existingUser = await query('SELECT id FROM users WHERE username = $1', [username]);
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'Username is already registered.' }, { status: 400 });
      }

      // Hash password securely with bcrypt
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Save user to PostgreSQL database
      const newUser = await query(
        'INSERT INTO users (username, display_name, password_hash) VALUES ($1, $2, $3) RETURNING id, username, display_name, role',
        [username, displayName, passwordHash]
      );

      const user = newUser.rows[0];
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      const response = NextResponse.json({ success: true, user });
      response.headers.set('Set-Cookie', `.ROBLOSECURITY=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
      return response;
    }

    // --- LOGIN LOGIC ---
    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Missing username or password fields.' }, { status: 400 });
      }

      // Search database for account entry
      const userRes = await query('SELECT * FROM users WHERE username = $1', [username]);
      if (userRes.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid username credentials.' }, { status: 400 });
      }

      const user = userRes.rows[0];

      // Enforce active moderation bans
      if (user.is_banned) {
        return NextResponse.json({ error: `Account Terminated: ${user.ban_reason}` }, { status: 403 });
      }

      // Compare cryptographic hashes
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect account password.' }, { status: 400 });
      }

      // Generate verification token cookie
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      const response = NextResponse.json({ 
        success: true, 
        user: { id: user.id, username: user.username, displayName: user.display_name, role: user.role } 
      });
      response.headers.set('Set-Cookie', `.ROBLOSECURITY=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
      return response;
    }

    return NextResponse.json({ error: 'Invalid authentication request parameter.' }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal system fault.' }, { status: 500 });
  }
}
