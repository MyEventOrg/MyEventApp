import { NextResponse, NextRequest } from "next/server";

function getRoleFromToken(token?: string): "admin" | "user" | undefined {
    if (!token) return;
    try {
        const payload = token.split(".")[1];
        const json = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        );
        const r = json?.rol ?? json?.role;
        return r === "admin" ? "admin" : r === "user" ? "user" : undefined;
    } catch {
        return;
    }
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = getRoleFromToken(token);
    const { pathname } = req.nextUrl;

    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    // rutas de usuario
    const isUserRoute =
        pathname === "/" ||
        pathname.startsWith("/perfil") ||
        pathname.startsWith("/crearEvento") ||
        pathname.startsWith("/misEventos") ||
        pathname.startsWith("/eventosGuardados") ||
        pathname.startsWith("/misAsistencias") ||
        pathname.startsWith("/evento") ||
        pathname.startsWith("/buscarEventos") ||
        pathname.startsWith("/editarEvento");

    // rutas de admin
    const isAdminRoute =
        pathname.startsWith("/eventosPublicos") ||
        pathname.startsWith("/eventosPrivados") ||
        pathname.startsWith("/gestionUsuarios");

    const isProtectedRoute = isUserRoute || isAdminRoute;

    // --- SIN sesión ---
    if (!token) {
        if (isProtectedRoute) {
            const url = new URL("/login", req.url);
            // url.searchParams.set("from", pathname);
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    //verificar estado usuario en el backend ---
    try {
        const res = await fetch("http://localhost:3001/check-status", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("token");
            return response;
        }

        const data = await res.json();
        if (data?.message === "Usuario inactivo" || data?.data?.activo === false) {
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("token");
            return response;
        }
    } catch (err) {
        console.error("Error verificando estado del usuario:", err);
    }

    // --- CON sesión en páginas de auth ---
    if (isAuthPage) {
        const dest = role === "admin" ? "/eventosPublicos" : "/";
        return NextResponse.redirect(new URL(dest, req.url));
    }

    // --- CON sesión, validar por rol ---
    if (isAdminRoute && role !== "admin") {

        return NextResponse.redirect(new URL("/", req.url));
    }
    if (isUserRoute && role !== "user") {
        return NextResponse.redirect(new URL("/eventosPublicos", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        // rutas usuario, si hay mas lo ponenn
        "/perfil/:path*",
        "/misEventos/:path*",
        "/eventosGuardados/:path*",
        "/crearEvento/:path*",
        "/misAsistencias/:path*",
        "/evento/:path*",
        "/buscarEventos/:path*",
        "/editarEvento/:path*",
        // rutas admin
        "/eventosPublicos/:path*",
        "/eventosPrivados/:path*",
        "/gestionUsuarios/:path*",
    ],
};
