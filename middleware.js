import { NextResponse } from 'next/server'
 
export function middleware(request) {
    const path = request.nextUrl.pathname

    const isPublicPath = path == '/signin'

    const token = request.cookies.get('token')?.value || ''

    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if(!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/signin', request.nextUrl))
    }
}

export const config = {
    matcher: [
        '/',
        '/user/:path*',
        '/signin',
        '/department/:path*',
        '/employee/:path*',
        '/data-entry/:path*',
        '/inventory/:path*',
        '/search/:path*',
        '/scan',
        '/profile'
    ],
}