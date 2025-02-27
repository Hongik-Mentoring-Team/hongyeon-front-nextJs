//layout이 가지고 있는 실질적인 layout => 즉, 모든 페이지에 적용
"use client"; // 변경사항: 클라이언트 컴포넌트 선언

import { ReactNode } from "react";
import Sidebar from "./(Components)/Sidebar";
import Navbar from "./(Components)/Navbar";
import { usePathname } from "next/navigation"; // 변경사항: 현재 경로 확인

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname(); // 변경사항: 현재 경로 가져오기
  const isLoginPage = pathname === "/login"; // 변경사항: 로그인 페이지 여부 확인

  return (
    <div>
      <nav className="pb-[66px]">
        <Navbar />
      </nav>

      {!isLoginPage && ( // 변경사항: 로그인 페이지에서는 Sidebar 숨김
        <aside className="w-64">
          <Sidebar />
        </aside>
      )}

      <main
        className={`flex w-full h-screen ${
          isLoginPage ? "justify-center items-center" : ""
        }`}
      >
        {/* 변경사항: 로그인 페이지에서는 중앙 정렬 적용 */}
        <div
          className={`flex-1 w-full h-auto ${
            isLoginPage ? "justify-center items-center bg-gray-50" : "pl-64"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardWrapper;
