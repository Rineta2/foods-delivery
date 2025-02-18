import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { Role } from '@/layout/router/context/interface/Auth';

// Paths that don't require authentication
const publicPaths = ['/auth', '/dashboard'];

// Role-based path mapping
const rolePathMap = {
    [Role.SUPER_ADMIN]: ['/dashboard/super-admins'],
    [Role.SELLER]: ['/dashboard/seller'],
    [Role.USER]: ['/dashboard/user']
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Check for authentication token and user role
    const token = request.cookies.get('auth-token');
    const userRole = request.cookies.get('user-role')?.value;

    // If no token or role, redirect to home page
    if (!token || !userRole) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check role-based access
    const allowedPaths = rolePathMap[userRole as unknown as Role] || [];
    const hasAccess = allowedPaths.some(path => pathname.startsWith(path));

    // If no access, redirect to home page instead of unauthorized
    if (!hasAccess) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};