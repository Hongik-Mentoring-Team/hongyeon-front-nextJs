// pages/index.js
// 변경사항: CRA에서 사용하던 환경변수(REACT_APP_BACKEND_URL)를 NEXT_PUBLIC_BACKEND_URL로 변경하였습니다.
// 변경사항: Next.js의 클라이언트 사이드 라우팅을 위해 Link 컴포넌트를 사용하도록 수정하였습니다.
// 변경사항: 기존 CRA App 컴포넌트를 Home 페이지로 변경하였으며, 필요에 따라 beforeLogin 레이아웃 컴포넌트를 추가할 수 있습니다.
"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // 변경사항: Next.js Link 사용

// Navbar 컴포넌트
const Navbar = () => {
  const [member, setMember] = useState(null);

  useEffect(() => {
    // 변경사항: 환경변수 이름을 NEXT_PUBLIC_BACKEND_URL로 수정
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/session`, {
      method: "GET",
      credentials: "include", // 세션 쿠키 전송
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("로그인된 사용자가 아닙니다.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data: ", data);
        setMember(data);
      })
      .catch((err) => {
        console.error("회원 정보 요청 실패:", err);
        setMember(null);
      });
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-2xl font-bold text-blue-600">캠퍼스 커넥트</div>
          <div className="hidden md:flex space-x-8">
            <NavLink href="/board">게시판</NavLink>
            <NavLink href="#mentors">멘토찾기</NavLink>
            <NavLink href="#about">서비스소개</NavLink>
            {member ? (
              // 로그인 상태이면 회원 이름 표시
              <span className="text-gray-700">{member.name}님</span>
            ) : (
              // 로그인되지 않은 상태이면 로그인 링크 표시
              <NavLink href="/loginNew">로그인</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// NavLink 컴포넌트 (Next.js Link 사용)
const NavLink = ({ href, children }) => <Link href={href}>{children}</Link>;

// Hero 컴포넌트
const Hero = () => (
  <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-gray-800">
    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
        선배와 후배의 만남, 더 나은 미래로 가는 길
      </h1>
      <p className="text-xl text-white/90 mb-8">
        현직에서 활동 중인 선배들의 경험과 조언으로 여러분의 꿈에 한 걸음 더
        가까워지세요.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="primary">멘티로 시작하기</Button>
        <Button variant="secondary">멘토로 참여하기</Button>
      </div>
    </div>
  </section>
);

// Button 컴포넌트
const Button = ({ variant, children }) => {
  const baseClasses =
    "px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105";
  const variants = {
    primary: "bg-white text-blue-600",
    secondary: "bg-transparent text-white border-2 border-white",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

// Features 컴포넌트
const Features = () => (
  <section id="features" className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          title="1:1 멘토링"
          description="관심 분야의 현직자와 1:1 멘토링을 통해 실질적인 경력 개발 조언을 받으세요."
        />
        <FeatureCard
          title="커리어 로드맵"
          description="선배들의 경력 경로를 통해 나만의 커리어 로드맵을 설계해보세요."
        />
        <FeatureCard
          title="네트워킹"
          description="같은 목표를 가진 동문들과 네트워크를 형성하고 함께 성장하세요."
        />
      </div>
    </div>
  </section>
);

// FeatureCard 컴포넌트
const FeatureCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-semibold text-blue-600 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Stats 컴포넌트
const Stats = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <StatItem number="1,000+" label="활동 멘토" />
        <StatItem number="5,000+" label="매칭 성사" />
        <StatItem number="50+" label="협력 대학" />
      </div>
    </div>
  </section>
);

// StatItem 컴포넌트
const StatItem = ({ number, label }) => (
  <div>
    <h2 className="text-4xl font-bold text-blue-600 mb-2">{number}</h2>
    <p className="text-gray-600">{label}</p>
  </div>
);

// Testimonials 컴포넌트
const Testimonials = () => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8">
        <TestimonialCard
          quote="현직 선배님과의 멘토링을 통해 진로를 확실히 정할 수 있었습니다. 실무 이야기를 들을 수 있어 매우 유익했어요."
          author="김철수"
          role="컴퓨터공학과 3학년"
        />
        <TestimonialCard
          quote="후배들에게 도움이 되는 경험을 공유할 수 있어서 보람찼습니다. 저 역시 많이 배우는 시간이었습니다."
          author="이영희"
          role="IT기업 5년차 개발자"
        />
      </div>
    </div>
  </section>
);

// TestimonialCard 컴포넌트
const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <p className="text-gray-600 mb-4">"{quote}"</p>
    <div>
      <strong className="text-gray-900">{author}</strong>
      <span className="text-gray-500 ml-2">- {role}</span>
    </div>
  </div>
);

// Footer 컴포넌트
const Footer = () => (
  <footer className="bg-gray-800 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">캠퍼스 커넥트</h3>
          <p className="text-gray-400">
            선배와 후배를 잇는 대학생 멘토링 플랫폼
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">문의하기</h3>
          <p className="text-gray-400">이메일: contact@campusconnect.kr</p>
          <p className="text-gray-400">전화: 02-123-4567</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">바로가기</h3>
          <div className="space-y-2 text-gray-400">
            <p>서비스 소개</p>
            <p>이용약관</p>
            <p>개인정보처리방침</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// 추가: beforeLogin 레이아웃 컴포넌트 (필요시 사용)
// 변경사항: 기존 레이아웃을 간소화한 후 로그인 완료 상태의 화면을 구성합니다.
const BeforeLogin = () => {
  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* 변경사항: 설명 페이지 padding-32px 적용 */}
      <div className="flex w-full h-72 px-32 justify-center items-center shadow-sm bg-gray-50">
        <span className="text-6xl text-blue-400">
          설명 페이지 + 로그인 완료
        </span>
      </div>

      {/* 변경사항: 멘토, 멘티 게시판 섹션 */}
      <div className="flex w-full h-auto px-24 gap-5">
        <div className="flex w-1/2 h-full p-4 bg-blue-50">멘토 게시판</div>
        <div className="flex w-1/2 h-full p-4 bg-blue-50">멘티 게시판</div>
      </div>
    </div>
  );
};

// Home 컴포넌트 (Next.js 페이지)
// 변경사항: CRA의 App 컴포넌트를 Next.js 페이지 형식으로 변환하였습니다.
const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Footer />

      {/* 필요에 따라 아래 beforeLogin 컴포넌트를 사용하실 수 있습니다. */}
      {/* <BeforeLogin /> */}
    </div>
  );
};

export default Home;
