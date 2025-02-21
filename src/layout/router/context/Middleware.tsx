import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { Role } from '@/layout/router/context/interface/Auth';

// Paths that are publicly accessible
const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/about',
    '/contact',
    '/browser-menu',
    '/special-offer',
    '/restaurant',
    '/track-order',
];

// Role-based path mapping
const rolePathMap = {
    [Role.SUPER_ADMIN]: ['/dashboard/super-admins'],
    [Role.SELLER]: ['/dashboard/seller'],
    [Role.USER]: ['/dashboard/user']
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow access to public paths without authentication
    if (publicPaths.some(path => pathname === path)) {
        return NextResponse.next();
    }

    // Get authentication token and user role from cookies
    const token = request.cookies.get('auth-token');
    const userRole = request.cookies.get('user-role')?.value;

    // If accessing dashboard paths
    if (pathname.startsWith('/dashboard')) {
        // If not authenticated, redirect to login
        if (!token || !userRole) {
            // Store the intended URL to redirect back after login
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Check role-based access
        const allowedPaths = rolePathMap[userRole as Role] || [];
        const hasAccess = allowedPaths.some(path => pathname.startsWith(path));

        // If no access, redirect to their appropriate dashboard
        if (!hasAccess) {
            const defaultPath = rolePathMap[userRole as Role]?.[0] || '/';
            return NextResponse.redirect(new URL(defaultPath, request.url));
        }
    }

    // For authenticated routes that aren't dashboard routes
    if (!token && !publicPaths.includes(pathname)) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
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
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    ],
};