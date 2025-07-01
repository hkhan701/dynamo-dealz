// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

// Enable middleware for only root route
export const config = {
  matcher: '/',
}

export function middleware(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || 'US'
  
  if (request.nextUrl.pathname === '/') {
    const redirectTo = country === 'CA' ? '/ca' : '/us'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return NextResponse.next()
}

