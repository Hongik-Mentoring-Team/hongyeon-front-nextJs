"use server";

// 클라이언트가 보낸 로그인 정보를 프론트 서버가 담당해서 백엔드 서버로 보낸다. (API 호출)

export async function fetchLogin() {
  const result = await fetch("URL");
  return result.json();
}
