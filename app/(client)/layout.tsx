"use client";

import "../globals.css";
import Header from "../components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldShowHeader =
    !pathname.startsWith("/misEventos") &&
    !pathname.startsWith("/perfil") &&
    !pathname.startsWith("/crearEvento") &&
    !pathname.startsWith("/evento/");

  return (
    <>
      {shouldShowHeader && <Header />}
      <div className={shouldShowHeader ? "px-12 py-8" : ""}>
        {children}
      </div>
    </>
  );
}
