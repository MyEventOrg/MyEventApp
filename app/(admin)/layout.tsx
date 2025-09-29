import type { Metadata } from "next";
import { Inria_Sans, Montserrat } from "next/font/google";
import "../../app/globals.css";
import Header from "./components/headerAdmin";
import Lateral from "./components/menuLateral";

const inriaSans = Inria_Sans({ subsets: ["latin"], variable: "--font-inria-sans", weight: ["300", "400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "MyEvent",
  description: "..Descripción MyEvent..",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inriaSans.variable} ${montserrat.variable}
                    grid grid-rows-[auto_1fr]`}>
      <Header />
      <div className="grid grid-cols-[16rem_1fr] min-h-0 overflow-hidden">
        <Lateral />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
