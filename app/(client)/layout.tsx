"use client";

import "../globals.css";
import Header from "../components/Header";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast"; // JUAN-MODIFICACION: Toast global

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldShowHeader =
    !pathname.startsWith("/misEventos") &&
    !pathname.startsWith("/perfil") &&
    !pathname.startsWith("/crearEvento") &&
    !pathname.startsWith("/evento/") &&
    !pathname.startsWith("/editarEvento/");;

  return (
    <>
      {/* JUAN-MODIFICACION: Toaster con z-index alto para mostrar sobre modales */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 9999,
          },
        }}
      />
      {shouldShowHeader && <Header />}
      <div className={shouldShowHeader ? "px-12 py-8" : ""}>
        {children}
      </div>
    </>
  );
}
