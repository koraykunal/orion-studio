"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Dashboard", href: "/admin", exact: true },
  { label: "Posts", href: "/admin/posts" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Messages", href: "/admin/messages" },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="flex w-60 flex-col border-r border-border bg-surface-1 h-screen sticky top-0">
      <div className="px-6 py-6">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Orion Studio" width={28} height={28} />
          <div className="flex flex-col">
            <span className="text-label text-foreground leading-tight">Orion Studio</span>
            <span className="text-[0.6rem] uppercase tracking-[0.12em] text-foreground-muted">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={`w-full justify-start px-3 py-2 text-label ${
              isActive(item.href, item.exact)
                ? "bg-accent/10 text-accent hover:bg-accent/15 hover:text-accent"
                : "text-foreground-muted hover:text-foreground hover:bg-surface-2"
            }`}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>

      <div className="px-3 py-4 space-y-0.5">
        <Separator className="mb-3" />
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start px-3 py-2 text-label text-foreground-muted hover:text-foreground hover:bg-surface-2"
        >
          <Link href="/">View site</Link>
        </Button>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full justify-start px-3 py-2 text-label text-foreground-muted hover:text-foreground hover:bg-surface-2"
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
