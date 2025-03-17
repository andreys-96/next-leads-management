import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simple mock authentication check
// In a real application, you would verify the session/token
const isAuthenticated = (request: NextRequest) => {
  // For demo purposes, we'll use a mock token
  const token = request.cookies.get('auth_token');
  return !!token;
};

export function middleware(request: NextRequest) {
  // Check if the request is for the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated(request)) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*']
}; 