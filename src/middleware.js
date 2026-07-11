import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // If a request hits auth.ziptrii.xyz, rewrite internally to /api/auth
  if (host.startsWith('auth.')) {
    url.pathname = `/api/auth${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  if (host.startsWith('users.')) {
    url.pathname = `/api/users${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (host.startsWith('games.')) {
    url.pathname = `/api/games${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  if (host.startsWith('asset.')) {
    url.pathname = `/api/asset${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Fallback serves standard website routes (/dashboard, /admin)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
