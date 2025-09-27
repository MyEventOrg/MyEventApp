import type { Metadata } from "next";
import { Inria_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const inriaSans = Inria_Sans({
  subsets: ["latin"],
  variable: "--font-inria-sans",
  weight: ["300", "400", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
export const metadata: Metadata = {
  title: "MyEvent",
  description: "..Descripción MyEvent..",
};


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${inriaSans.variable} ${montserrat.variable}`}>

        {children}
      </body>
    </html>
  );
}
