"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Settings, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  if (pathname !== "/" && pathname !== "/settings") return null

  const links = [
    {
      href: "/",
      label: "Panolar",
      icon: LayoutDashboard,
    },
    {
      href: "/settings",
      label: "Ayarlar",
      icon: Settings,
    },
  ]

  return (
    <aside className="hidden md:flex flex-col h-screen w-72 bg-[#1c1c1c] border-r border-[#2a2a2a] shadow-lg">
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-4 pt-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-[#313543] text-white"
                : "text-zinc-400 hover:bg-[#2a2d3a] hover:text-white"
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Profil */}
      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#313543] flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Profilim</span>
              <span className="text-xs text-zinc-500">admin@example.com</span>
            </div>
          </div>
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-[#2a2d3a] rounded-lg transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
