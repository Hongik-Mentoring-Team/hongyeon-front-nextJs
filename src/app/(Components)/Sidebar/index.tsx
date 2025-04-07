"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutList, UserCircle } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

const SidebarLink = ({ href, icon, children, isActive }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium
        transition-all duration-200 ease-in-out
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-neutral-800 hover:bg-blue-100 hover:text-blue-800"
        }
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

interface SidebarProps {
  navbarHeight?: number;
}

export function Sidebar( { navbarHeight }:SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "홈", icon: <Home size={22} /> },
    {
      href: "/Community/mentor",
      label: "멘토 게시판",
      icon: <LayoutList size={22} />,
    },
    {
      href: "/Community/mentee",
      label: "멘티 게시판",
      icon: <LayoutList size={22} />,
    },
    { href: "/profile", label: "마이페이지", icon: <UserCircle size={22} /> },
  ];

  return (
    <aside className="fixed left-0 w-64 flex flex-col border-r border-neutral-200 bg-white px-6 py-8 shadow-sm"
    style={{ top: `${navbarHeight}px`, height: `calc(100vh - ${navbarHeight}px)` }} // ✅ 위치와 높이 지정
      >
      {/* 상단 브랜드 영역
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
          홍익멘토
        </h1>
        <p className="text-sm text-neutral-500 mt-1">오픈소스 멘토링 서비스</p>
      </div> */}

      {/* 메뉴 리스트 */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <li key={item.href}>
              <SidebarLink
                href={item.href}
                icon={item.icon}
                isActive={pathname === item.href}
              >
                {item.label}
              </SidebarLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* 하단 카피라이트 */}
      <div className="mt-12 pt-6 border-t text-center">
        <p className="text-xs text-neutral-400 leading-5">
          © 2025 홍익멘토
          <br />
          모든 권리 보유
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
