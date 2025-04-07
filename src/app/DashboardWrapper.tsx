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

      {!isLoginPage && (
        <aside className="hidden md:block w-64">
          <Sidebar />
        </aside>
      )}

      <main
        className={`flex w-full h-screen ${
          isLoginPage ? "justify-center items-center" : ""
        }`}
      >
        <div
          className={`flex-1 w-full h-auto ${
            isLoginPage
              ? "justify-center items-center bg-gray-50"
              : "md:pl-64 pl-0"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardWrapper;
