"use client";

import React from "react";

const Login = () => {
  const handleSocialLogin = (provider: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("백엔드 URL이 설정되지 않았습니다.");
      return;
    }

    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        {/* 로그인 제목 */}
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          로그인
        </h2>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-4">
          <button
            className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            onClick={() => handleSocialLogin("google")}
          >
            🚀 구글 로그인
          </button>
          <button
            className="w-full py-3 text-lg bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
            onClick={() => handleSocialLogin("naver")}
          >
            🌿 네이버 로그인
          </button>
        </div>

        {/* 추가 정보 */}
        <p className="text-center text-gray-500 text-sm mt-6">
          소셜 로그인으로 안전하게 서비스를 이용하세요.
        </p>
      </div>
    </div>
  );
};

export default Login;
