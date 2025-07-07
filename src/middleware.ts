// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which paths are public (e.g., login, signup, static assets)
const PUBLIC_FILE = /\.(.*)$/;
const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// ✅ Allow public files and routes
	if (
		publicRoutes.includes(pathname) ||
		PUBLIC_FILE.test(pathname) ||
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api/public')
	) {
		return NextResponse.next();
	}

	const token = request.cookies.get('ssr_token')?.value;

	// ❌ No token? Redirect to login
	if (!token) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (pathname === '/') {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}
