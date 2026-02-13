import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/jobs', '/profile', '/subscribe']
// Public routes that authenticated users should be redirected away from
const publicRoutes = ['/login', '/register']

// Paths that should bypass middleware processing entirely
const bypassPaths = ['/api/', '/admin', '/_next/', '/_vercel/', '/favicon.ico', '/_static']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for bypass paths
  if (bypassPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is public (should redirect authenticated users)
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get the authentication token from cookies
  const token = request.cookies.get('payload-token')?.value

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated user tries to access public routes, redirect to dashboard
  if (isPublicRoute && token) {
    // Skip server-side verification in middleware - rely on client-side redirect
    // This prevents cold start issues in serverless
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
