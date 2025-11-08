"use client";

import { useRouter } from "next/navigation";

interface NoMainHeaderProps {
  title: string;
}

export default function NoMainHeader({ title }: NoMainHeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full mx-auto py-8 px-12 bg-white border-b-[1.5px] border-bordergray flex items-center gap-5">
      <img
        src="/Arrow Pointing Left.svg"
        alt="Volver"
        className="w-9 cursor-pointer"
        onClick={() => router.back()}
      />
      <div className="font-bold text-black text-3xl">{title}</div>
    </header>
  );
}
