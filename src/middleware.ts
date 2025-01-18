import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                    request.nextUrl.pathname.startsWith('/signup') ||
                    request.nextUrl.pathname.startsWith('/verify')

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check role-based access
  if (token && request.nextUrl.pathname.startsWith('/dashboard')) {
    const userRole = token.role as string
    const isAdminRoute = request.nextUrl.pathname.includes('/users') ||
                        request.nextUrl.pathname.includes('/messages')

    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/verify']
}