"use client";

import React from "react";

const Login = () => {
  {
    /* 버튼 클릭 시 백엔드 서버로 요청 전송 */
  }
  const handleSocialLogin = (provider: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("백엔드 URL이 설정되지 않았습니다.");
      return;
    }

    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-10">
          HongikMentor
        </h2>

        <div className="w-full max-w-md p-10 rounded-lg shadow-lg bg-white">
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
            소셜 로그인으로 서비스를 안전하게 이용하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
