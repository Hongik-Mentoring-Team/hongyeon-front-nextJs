"use client";

import { ReactNode } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { usePathname } from "next/navigation";

const NAVBAR_HEIGHT = 70; // ✅ 여기서 높이 설정

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div>
      {/* ✅ 높이 prop으로 전달 */}
      <Navbar height={NAVBAR_HEIGHT} />

      {!isLoginPage && (
        <aside
          className="fixed left-0 w-64 z-40 border-r border-neutral-200 bg-white shadow-md"
          style={{
            top: `${NAVBAR_HEIGHT}px`,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
        >
          <Sidebar navbarHeight={NAVBAR_HEIGHT} />
        </aside>
      )}

      <main
        className={`pt-[${NAVBAR_HEIGHT}px] flex w-full min-h-screen ${
          isLoginPage ? "justify-center items-center" : ""
        }`}
      >
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

export default DefaultLayout;
