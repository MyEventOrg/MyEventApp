"use client";

import Link from "next/link";
import { CalendarDays, Users2, Megaphone } from "lucide-react";

type IconName = "calendar" | "users" | "megaphone";

function Icon({ name, className }: { name: IconName; className?: string }) {
    if (name === "users") return <Users2 className={`w-5 h-5 ${className || ""}`} />;
    if (name === "megaphone") return <Megaphone className={`w-5 h-5 ${className || ""}`} />;
    return <CalendarDays className={`w-5 h-5 ${className || ""}`} />;
}

export default function StatsCard({
    title,
    value,
    icon = "calendar",
    href,
    numberClass = "",
    iconClass = "",
}: {
    title: string;
    value: number | string;
    icon?: IconName;
    href?: string;
    numberClass?: string;
    iconClass?: string;
}) {
    const content = (
        <div className="flex items-center gap-3 w-[331px] h-[114px] bg-white rounded-[20px] border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <Icon name={icon} className={iconClass} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm text-gray-500">{title}</span>
                <span className={`text-2xl font-semibold leading-tight ${numberClass}`}>{value}</span>
            </div>
        </div>
    );

    return href ? (
        <Link href={href} className="block hover:translate-y-[-1px] transition-transform">
            {content}
        </Link>
    ) : (
        content
    );
}
