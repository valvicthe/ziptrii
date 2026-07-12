// /src/app/api/auth/discord/callback/route.js
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Await the cookies for Next.js 15+ compatibility
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  
  // Use the env variable or a fallback to prevent localhost redirects
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ziptrii.up.railway.app';

  // Debugging logs to help you spot the "Missing Cookie" issue in Railway Logs
  console.log("--- CALLBACK DEBUG ---");
  console.log("Attempted UserId cookie value:", userId);
  console.log("Auth Code present:", !!code);

  // If we don't have a code or a user ID, redirect back to settings
  if (!code || !userId) {
    console.log("Redirecting to settings due to missing session or code.");
    return NextResponse.redirect(new URL('/settings', baseUrl));
  }

  try {
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
    
    if (tokenData.error) {
      console.error("Discord Token Error:", tokenData);
      return NextResponse.redirect(new URL('/settings', baseUrl));
    }

    // 2. Fetch User Profile
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    // 3. Link account in DB
    await query('UPDATE users SET discord_id = $1 WHERE id = $2', [userData.id, userId]);
    console.log(`Successfully linked Discord ID ${userData.id} to DB User ${userId}`);

  } catch (error) {
    console.error("Auth Callback Error:", error);
  }

  // 4. Final Redirect
  return NextResponse.redirect(new URL('/settings', baseUrl));
}
