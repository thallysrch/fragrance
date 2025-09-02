import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = new URL(req.url)
  if (url.pathname === '/cart' && req.method === 'POST') {
    // handle add via form post and persist in localStorage alternative: redirect with query
  }
  return NextResponse.next()
}

