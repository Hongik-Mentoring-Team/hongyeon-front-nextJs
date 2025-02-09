import Link from "next/link";

interface SidebarLinkProps {
  // href: string;
  label: string;
  href: string;
}

const SidebarLink = ({ label, href }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className="cursor-pointer flex items-center justify-start pl-4 text-xl hover:bg-blue-100"
    >
      {label}
    </Link>
  );
};

import React from "react";

const Sidebar = () => {
  // const memberID = "123";
  return (
    <div className="fixed flex flex-col justify-between w-64 h-screen p-4 pb-[100px] shadow-md border-r-2">
      {/* Menu */}
      <div className="flex flex-col h-64 justify-between mt-4 gap-5">
        <SidebarLink label={`홈`} href="/login/beforelogin" />
        {/* <SidebarLink label={`멘토멘티 신청하기`} href=""/> */}
        <SidebarLink label={`멘토 게시판`} href="/Community/mentor" />
        <SidebarLink label={`멘티 게시판`} href="/Community/menti" />
        <SidebarLink label={`마이 페이지`} href={`/profile`} />
      </div>

      {/* Footer */}
      <div>
        <p className="items-center text-center text-xs text-gray-500">
          &copy; 2025 HongikMentor
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
