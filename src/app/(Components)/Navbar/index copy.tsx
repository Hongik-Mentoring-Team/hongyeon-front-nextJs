"use client";

import React, { useEffect, useState } from "react";
import { Bell, CircleUserRound, Settings } from "lucide-react";
import Link from "next/link";
import Button from "@/app/(Components)/ui/Button"; // 변경사항: 공통 Button 컴포넌트 import

const Navbar = () => {
  const [user, setUser] = useState<string | null>(null);

  // ✅ 백엔드에 사용자 세션 정보 요청
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/session`,
          { credentials: "include" } // ✅ 세션 쿠키 포함
        );

        if (!res.ok) throw new Error("사용자 세션 정보를 불러올 수 없습니다.");
        const data = await res.json();
        // ✅ 사용자 이름이 있으면 상태 업데이트
        setUser(data.name || null);
        // 사용자 존재 확인
        console.log("현재 사용자:", user);
      } catch (error) {
        console.error("세션 요청 실패:", error);
        setUser(null);
      }
    };

    fetchUserSession();
  }, []);

  // ✅ 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("로그아웃 실패");
      setUser(null); // ✅ 상태 초기화
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="fixed flex justify-between items-center w-full h-[66px] px-6 border-b border-neutral-100 bg-white z-50">
      {/* Left Side */}
      <div className="flex items-center text-xl font-semibold text-neutral-900">
        <Link href="/">HongikMentor</Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="search"
            placeholder="원하는 질문 찾아보기"
            className="pl-10 pr-4 py-2 w-72 border border-neutral-100 bg-white rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-0 pl-3">
            <Bell className="w-5 h-5 text-neutral-400" />
          </div>
        </div>

        {/* Setting (추후 다크 모드 도입 예정) */}
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-neutral-400 hover:text-neutral-600 cursor-pointer" />
        </div>

        {/* ✅ 로그인 상태 확인 후 버튼 표시 */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* 작은 사람 아이콘 → 클릭 시 /profile 이동 */}
            <Link href="/profile">
              <CircleUserRound className="w-6 h-6 text-neutral-500 hover:text-neutral-700 cursor-pointer" />
            </Link>
            <span className="text-neutral-700 text-sm">{user} 님,</span>
            <Button variant="danger" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4">
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
  );
};

export default Navbar;
