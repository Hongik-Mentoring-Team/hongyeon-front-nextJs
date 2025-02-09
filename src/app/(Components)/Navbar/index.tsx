"use client";
import React from "react";
import { Bell, Settings } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [login, setLogin] = React.useState([]);

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

        {/* Setting /추후에 다크 모드 도입입 */}
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-gray-500" />
        </div>

        {/* 로그인, 회원가입 */}
        <div className="flex justify-center items-center gap-4">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <Link href="/login">로그인</Link>
          </button>

          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <Link href="/">회원가입</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
