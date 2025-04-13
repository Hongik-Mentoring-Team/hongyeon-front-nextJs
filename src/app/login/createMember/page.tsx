"use client"; // 변경사항: 클라이언트 컴포넌트 선언

import { useEffect, useState } from "react";
import Input from "@/app/(Components)/ui/Input";
import Button from "@/app/(Components)/ui/Button";
import { UserPlus, BookOpen, GraduationCap, User } from "lucide-react";

const CreateMember = () => {
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
      window.location.href = "/"; // 로그아웃 후 메인페이지가 강제로 리렌더링하도록 설정
    } catch (err) {
      console.error(err);
      setError("회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  // 로딩 화면
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-40 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );

  // 오류 화면
  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-gray-800 font-medium">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">
          {/* 헤더 영역 */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white border-b border-gray-300">
            <h2 className="text-center text-3xl md:text-4xl font-bold">
              HongikMentor
            </h2>
            <p className="text-center text-white/90 mt-3 text-lg">
              {name}님 반갑습니다
            </p>
          </div>

          {/* 폼 영역 */}
          <div className="p-8 md:p-10 w-full">
            <form className="space-y-7 w-full" onSubmit={handleSubmit}>
              <div className="space-y-3 w-full">
                <label className="flex items-center text-base font-medium text-gray-700">
                  <User size={18} className="mr-2 text-primary" />
                  이름
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full py-3 border border-gray-300 focus:border-primary"
                />
              </div>

              <div className="space-y-3 w-full">
                <label className="flex items-center text-base font-medium text-gray-700">
                  <BookOpen size={18} className="mr-2 text-primary" />
                  전공
                </label>
                <Input
                  id="major"
                  name="major"
                  type="text"
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="전공을 입력하세요"
                  className="w-full py-3 border border-gray-300 focus:border-primary"
                />
              </div>

              <div className="space-y-3 w-full">
                <label className="flex items-center text-base font-medium text-gray-700">
                  <GraduationCap size={18} className="mr-2 text-primary" />
                  졸업년도
                </label>
                <Input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="예: 2025"
                  className="w-full py-3 border border-gray-300 focus:border-primary"
                />
              </div>

              <div className="pt-6 w-full">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-lg border border-transparent hover:border-gray-300"
                  icon={<UserPlus size={20} />}
                >
                  가입하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMember;
