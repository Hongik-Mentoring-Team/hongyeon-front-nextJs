"use client";

import React, { useEffect, useState } from "react";
import { Bell, CircleUserRound, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/(Components)/ui/Button"; // 공통 버튼 컴포넌트

// const NAVBAR_HEIGHT = 65; // 고정 높이(px) – tailwind 기준 h-16
interface NavbarProps {
  height: number;
}
const Navbar = ({ height }: NavbarProps) => {
  const [user, setUser] = useState<string | null>(null);

  // 사용자 세션 정보를 백엔드에서 요청
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/session`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("사용자 세션 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setUser(data.name || null);
      } catch (error) {
        console.error("세션 요청 실패:", error);
        setUser(null);
      }
    };

    fetchUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("로그아웃 실패");
      setUser(null);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-white border-b border-neutral-200 shadow-sm"
      style={{ height: `${height}px` }}
    >
      <div className="flex h-full w-full  items-center gap-8 px-10 ">
        {/* 좌측 로고 */}
        <div className="pl-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="홍이음 로고"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>
        {/* 중앙 검색창 */}
        <div className="hidden sm:flex flex-1 items-center justify-center px-8">
          <div className="relative w-full max-w-md">
            <input
              type="search"
              placeholder="원하는 질문 찾아보기"
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Bell className="w-4 h-4 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* 우측 유저 액션 */}
        <div className="flex  gap-5 ml-auto">
          <Settings className="w-5 h-5 text-neutral-400 hover:text-neutral-700 cursor-pointer" />

          {/* 유저 정보 */}
          {/* 로그인 상태에 따라 다르게 표시 */}
          {user ? (
            <div className="flex items-center gap-2 pr-4">
              <Link href="/profile">
                <CircleUserRound className="w-6 h-6 text-neutral-500 hover:text-neutral-700 cursor-pointer" />
              </Link>
              <span className="text-sm font-medium text-neutral-700">
                {user} 님
              </span>
              <Button variant="danger" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="primary">로그인</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">회원가입</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
