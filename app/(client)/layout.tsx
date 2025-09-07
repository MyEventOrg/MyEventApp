"use client";

import "../globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noHeaderRoutes = ["/eventosGuardados", "/eventosPublicos", "/perfil"];

  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <div className={shouldShowHeader ? "px-12 py-8" : ""}>
        {children}
      </div>
    </>
  );
}
