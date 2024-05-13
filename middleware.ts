import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './app/actions/session'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const session = await getSession()
    if(!session?.user.id) {
      return NextResponse.redirect(new URL('/logout', request.url))
    }
        
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!sso|logout|jwt|api|_next/static|_next/image|favicon.ico).*)',
}