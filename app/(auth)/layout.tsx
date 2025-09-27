import type { Metadata } from "next";
import { Inria_Sans, Montserrat } from "next/font/google";
import "../../app/globals.css";

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
    <div className={`${inriaSans.variable} ${montserrat.variable}`}>
      <div className="min-h-screen flex items-center justify-center bg-[#cfe4f9]">
        <div className="bg-[#cfe4f9] p-8 rounded-lg w-full max-w-md text-center shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
