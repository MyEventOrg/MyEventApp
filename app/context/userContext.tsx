"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type UserPayload = {
    usuario_id: number;
    apodo: string;
    rol: "user" | "admin" | string;
    iat: number;
};

type UserContextType = {
    user: UserPayload | null;
    loading: boolean;
    isAuthenticated: boolean;
    refreshFromCookie: () => void;
    clearUser: () => void;
};

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    refreshFromCookie: () => { },
    clearUser: () => { },
});

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const v = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="));
    return v ? decodeURIComponent(v.split("=")[1]) : null;
}


function decodeJwt<T = any>(token: string): T | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const base64url = parts[1];
        const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const json = atob(padded);
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserPayload | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshFromCookie = () => {
        setLoading(true);
        try {
            const token = getCookie("token");
            if (!token) {
                setUser(null);
                return;
            }

            const payload = decodeJwt<UserPayload>(token);
            if (!payload) {
                setUser(null);
                return;
            }

            setUser(payload);

        } catch (err) {
            console.error("Error en refreshFromCookie:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    const clearUser = () => setUser(null);

    useEffect(() => {
        refreshFromCookie();
        const onFocus = () => refreshFromCookie();
        window.addEventListener("visibilitychange", onFocus);
        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("visibilitychange", onFocus);
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: !!user,
            refreshFromCookie,
            clearUser,
        }),
        [user, loading]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
