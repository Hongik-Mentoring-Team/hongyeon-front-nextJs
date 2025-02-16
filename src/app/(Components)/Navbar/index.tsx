"use client";

import React, { useEffect, useState } from "react";
import { Bell, CircleUserRound, Settings } from "lucide-react";
import Link from "next/link";

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
    <div className="fixed flex justify-between items-center w-full h-[66px] px-5 border-b-2 bg-white">
      {/* Left Side */}
      <div className="flex items-center text-xl">
        <Link href="/">HongikMentor</Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="search"
            placeholder="원하는 질문 찾아보기"
            className="pl-10 pr-4 py-2 w-72 border-2 border-gray-500 bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="absolute left-0 pl-3">
            <Bell className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Setting (추후 다크 모드 도입 예정) */}
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-gray-500" />
        </div>

        {/* ✅ 로그인 상태 확인 후 버튼 표시 */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* 작은 사람 아이콘 → 클릭 시 /profile 이동 */}
            <Link href="/profile">
              <CircleUserRound className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
            </Link>
            <span className="text-gray-700">{user} 님,</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-700"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4">
            <Link href="/login">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                로그인
              </button>
            </Link>

            <Link href="/signup">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                회원가입
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
