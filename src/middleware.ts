// middleware.ts
// 변경사항 주석: 모든 경로를 보호하되, 특정 예외 페이지만 제외하고,
//               세션 쿠키와 백엔드 호출을 통해 실제 로그인 여부를 판단 후
//               로그인되지 않았다면 /login/beforelogin으로 리다이렉트

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 백엔드 세션 검증 함수 (비동기로 백엔드에 요청)
async function verifySession(
  cookieValue: string | undefined
): Promise<boolean> {
  if (!cookieValue) {
    return false;
  }

  try {
    // 백엔드 서버에 세션 검증 요청
    // 변경사항 주석: 실제 API URL, 메서드, 헤더 등을 백엔드에 맞게 수정
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/session`,
      {
        method: "GET",
        // middleware(Edge)에서는 기본적으로 credentials: "include" 처리가 제한적이므로,
        // 필요 시 쿠키를 직접 헤더로 전달할 수도 있습니다.
        headers: {
          Cookie: `JSESSIONID=${cookieValue}`,
        },
      }
    );

    // 세션이 유효하면(res.ok === true) true 반환
    if (res.ok) {
      console.log("세션 인증성공");
      return true;
    }
    // 세션이 유효하지 않다면 false
    return false;
  } catch (error) {
    console.error("세션 검증 오류:", error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  console.log("미들웨어 실행됨");
  const { pathname } = req.nextUrl;

  // 변경사항 주석: 예외 경로들(로그인, 회원가입, 정적파일 등)을 미리 지정
  // 예) /login, /join, /public 등
  const excludedRoutes = [
    "/login",
    // "/join",
    // "/api",    // API 라우트 예시 (필요 시 제외)
    "/static", // 정적 파일 경로 예시
    // etc...
  ];

  // 만약 예외 경로 중 하나와 매칭된다면, 미들웨어 통과
  if (excludedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 위 예외를 제외한 모든 경로는 보호된 페이지로 간주
  // 세션 쿠키 추출
  const sessionCookie = req.cookies.get("JSESSIONID")?.value;
  console.log(sessionCookie + "를 추출함");

  // 백엔드 서버에 세션 유효성 확인
  const isValidSession = await verifySession(sessionCookie);

  // 세션이 유효하지 않다면 로그인 페이지로 강제 이동
  if (!isValidSession) {
    return NextResponse.redirect(new URL("/login/beforelogin", req.url));
  }

  // 세션이 유효하다면 정상 진행
  return NextResponse.next();
}

// 변경사항 주석: matcher로 전체를 대상으로 하되, Next.js 내부 파일은 제외
export const config = {
  matcher: [
    // 모든 경로를 대상으로 하지만,
    // _next(내부 라우트)나 정적파일(.ico, .png, .jpg 등)은 자동 제외되도록 설정
    "/((?!_next|.*\\..*).*)",
  ],
};
