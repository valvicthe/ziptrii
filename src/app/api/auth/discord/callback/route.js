// /src/app/api/auth/discord/callback/route.js
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const userId = (await cookies()).get('userId')?.value;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ziptrii.up.railway.app';
  return NextResponse.redirect(new URL('/settings', baseUrl));
  
  // 1. Exchange code for token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();
  
  // 2. Fetch User Profile
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // 3. Link account in DB
  await query('UPDATE users SET discord_id = $1 WHERE id = $2', [userData.id, userId]);

  return NextResponse.redirect(new URL('/settings', request.url));
}
