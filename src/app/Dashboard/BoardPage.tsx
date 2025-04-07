"use client";

import { useEffect } from "react";
import { ArrowDown } from "lucide-react";

export default function BoardPage() {
  // ✅ 스크롤 부드럽게
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="h-screen w-full snap-y snap-mandatory overflow-scroll scroll-smooth font-sans">
      {/* Slide 1 - 서비스 소개 */}
      <section
        id="intro"
        className="relative flex h-screen w-full snap-start items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800 px-4"
      >
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            홍익 오픈소스 멘토링 서비스, 홍이음
          </h1>
          <p className="max-w-2xl text-xl text-blue-100 md:text-2xl">
            당신의 지식을 나누고, 함께 성장하세요.
          </p>
          <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg">
              멘토로 참여하기
            </button>
            <button className="rounded-lg bg-transparent px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-white/10 hover:shadow-lg">
              멘티로 참여하기
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white">
          <a href="#philosophy" aria-label="Scroll to next section">
            <ArrowDown size={32} />
          </a>
        </div>
      </section>

      {/* Slide 2 - 철학 + 기존 설명 박스 병합 */}
      <section
        id="philosophy"
        className="relative flex min-h-screen w-full snap-start flex-col items-center justify-center gap-10 bg-gray-50 px-4 py-20"
      >
        {/* ✅ 기존 BoardPage 상단 설명 박스
        <div className="flex w-full max-w-5xl h-72 px-8 md:px-32 justify-center items-center shadow-sm bg-white rounded-xl">
          <span className="text-4xl md:text-6xl text-blue-400 font-semibold">
            설명 페이지
          </span>
        </div> */}

        {/* 철학 3개 박스 */}
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            멘토링도 오픈소스처럼
          </h2>
          <p className="max-w-3xl text-center text-lg leading-relaxed text-gray-700 md:text-xl">
            홍이음은 오픈소스 철학을 바탕으로, 멘토링의 전 과정을 투명하게
            공개합니다. 지식은 공유되어야 하며, 우리 모두의 성장을 위한
            것입니다.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl">
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                투명성
              </h3>
              <p className="text-gray-600">
                모든 멘토링 과정과 자료를 공개하여 누구나 학습할 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl">
              <h3 className="mb-3 text-xl font-semibold text-gray-800">협력</h3>
              <p className="text-gray-600">
                멘토와 멘티가 함께 성장하는 상호 협력적 관계를 지향합니다.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl">
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                지속가능성
              </h3>
              <p className="text-gray-600">
                지식의 선순환을 통해 지속 가능한 학습 생태계를 만듭니다.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-700">
          <a href="#future" aria-label="Scroll to next section">
            <ArrowDown size={32} />
          </a>
        </div>
      </section>

      {/* Slide 3 - 미래 전망 + 기존 게시판 병합 */}
      <section
        id="future"
        className="flex min-h-screen w-full snap-start flex-col items-center justify-center gap-16 bg-gray-100 px-4 py-20"
      >
        <div className="max-w-4xl">
          <div className="rounded-xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              홍이음의 미래
            </h2>
            <p className="mx-auto max-w-2xl text-center text-md leading-relaxed text-gray-800 md:text-lg">
              우리는 1년간의 운영을 계획하고 있습니다. 그 과정에서 사용자
              피드백을 반영하여 꾸준히 업데이트하며, 종료되더라도 멘토링 내용은
              아카이빙되어 계속 공개됩니다. 향후 반응에 따라 연장 운영도
              고려하고 있습니다.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  지속적인 개선
                </h3>
                <p className="text-gray-600">
                  사용자 피드백을 바탕으로 서비스를 지속적으로 개선합니다.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  지식 아카이빙
                </h3>
                <p className="text-gray-600">
                  모든 멘토링 내용은 아카이빙되어 미래의 학습자들에게도 가치를
                  제공합니다.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  커뮤니티 확장
                </h3>
                <p className="text-gray-600">
                  홍익대학교를 넘어 더 넓은 커뮤니티로 확장을 목표로 합니다.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  오픈소스 기여
                </h3>
                <p className="text-gray-600">
                  멘토링 플랫폼 자체도 오픈소스로 공개하여 기술 발전에
                  기여합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 
        ✅ 기존 BoardPage의 멘토·멘티 게시판 병합
        <div className="flex w-full max-w-6xl flex-col gap-5 px-6 md:px-24">
          <div className="flex w-full h-auto gap-5">
            <div className="flex w-1/2 h-full p-4 bg-blue-50 rounded-xl shadow-sm">
              멘토 게시판
            </div>
            <div className="flex w-1/2 h-full p-4 bg-blue-50 rounded-xl shadow-sm">
              멘티 게시판
            </div>
          </div>
        </div> */}
      </section>
    </main>
  );
}
