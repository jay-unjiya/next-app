import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXT_SECRET })
    const protectedRoutes = ['/items', '/dashboard','/additem']
    if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL('/user/login', req.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard', '/items','/additem']
}