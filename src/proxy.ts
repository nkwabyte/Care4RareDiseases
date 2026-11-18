import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/patients', '/reports', '/database', '/settings', '/help'];
const SESSION_COOKIES = ['__Host-c4r_session', 'c4r_session'];

function buildCsp(nonce: string): string {
    const isDev = process.env.NODE_ENV === 'development';
    return [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
        // Radix/Recharts/Sonner emit inline style attributes, which nonces cannot cover.
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' blob: data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        ...(isDev ? [] : ['upgrade-insecure-requests']),
    ].join('; ');
}

/**
 * 1. Optimistic auth gate: no session cookie → redirect to /login. Real verification
 *    (token hash, expiry, role, patient access) happens in every server action.
 * 2. Per-request nonce CSP.
 */
export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));

    if (!hasSession && PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const csp = buildCsp(nonce);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', csp);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', csp);
    return response;
}

export const config = {
    matcher: [
        {
            source: '/((?!_next/static|_next/image|favicon.ico|icon.svg|genotype_phenotype_template.csv).*)',
            missing: [{ type: 'header', key: 'next-router-prefetch' }],
        },
    ],
};
