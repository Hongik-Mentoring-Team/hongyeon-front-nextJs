"use client"; // 변경사항: 클라이언트 컴포넌트 선언

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 변경사항: Next.js 라우터 사용

const CreateMember = () => {
  const router = useRouter(); // 변경사항: Next.js에서 리다이렉트 처리

  const [name, setName] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [graduationYear, setGraduationYear] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------
  // 세션 정보 요청 (GET)
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/session`, {
      method: "GET",
      credentials: "include", // 세션 쿠키 전송
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("백엔드 세션 응답 데이터: ", data);
        setName(data.name || ""); // 변경사항: 기본값 설정
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);
  // -----------------------------------------------------------------
  // 회원 등록 (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const memberRegisterDto = {
      name,
      major,
      graduationYear: parseInt(graduationYear, 10),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members`,
        {
          method: "POST",
          credentials: "include", // 변경사항: 세션 유지
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberRegisterDto),
        }
      );

      if (!response.ok) {
        throw new Error("회원가입 요청이 실패했습니다.");
      }

      console.log("회원가입 성공");

      // 회원가입 성공 후, 세션종료 요청 & 홈 리다이렉트
      const logoutResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!logoutResponse.ok) {
        throw new Error("로그아웃 실패");
      }

      console.log("세션 종료");
      router.push("/"); // 변경사항: Next.js 방식으로 홈으로 리다이렉트
    } catch (err) {
      console.error(err);
      setError("회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  // 로딩 화면
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p>로딩중...</p>
      </div>
    );

  // 오류 화면
  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* 로고 및 타이틀 */}
        <h2 className="text-center text-3xl font-bold text-blue-600 mb-2">
          캠퍼스 커넥트
        </h2>
        <h3 className="text-center text-xl text-gray-600 mb-6">
          {name}님 반갑습니다. 회원가입을 진행해주세요.
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="major"
                className="block text-sm font-medium text-gray-700"
              >
                전공
              </label>
              <div className="mt-1">
                <input
                  id="major"
                  name="major"
                  type="text"
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="전공을 입력하세요"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-gray-700"
              >
                졸업년도
              </label>
              <div className="mt-1">
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="예: 2025"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMember;
