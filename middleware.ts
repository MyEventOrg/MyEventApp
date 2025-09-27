import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    const isProtectedRoute =
        pathname === "/" ||
        pathname.startsWith("/perfil") ||
        pathname.startsWith("/crearEvento") ||
        pathname.startsWith("/misEventos") ||
        pathname.startsWith("/eventosGuardados");

    //--- usuario SIN sesión ---
    if (!token) {
        if (isProtectedRoute) {
            const url = new URL("/login", req.url);
            //url.searchParams.set("from", pathname);
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    //--- usuario CON sesión ---
    if (isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/perfil/:path*",
        "/misEventos/:path*",
        "/eventosGuardados/:path*",
        "/crearEvento/:path*",
    ],
};
