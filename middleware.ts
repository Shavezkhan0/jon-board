import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from './src/payload.config'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/jobs', '/profile', '/subscribe']
// Public routes that authenticated users should be redirected away from
const publicRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is public (should redirect authenticated users)
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // Get the authentication token from cookies
  const token = request.cookies.get('payload-token')?.value

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated user tries to access public routes, redirect to dashboard
  if (isPublicRoute && token) {
    try {
      // Verify the token
      const payload = await getPayload({ config: payloadConfig })
      const { user } = await (payload as any).verifyToken({
        collection: 'users',
        token,
      })

      if (user) {
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    } catch (error) {
      // Token is invalid, continue to the public route
      console.error('Token verification failed:', error)
    }
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
