export default async function fetchProfile() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/members/me`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }
    ); // 프로필 API 요청 (경로 수정 가능)
    if (!res.ok) throw new Error("프로필 데이터를 불러올 수 없습니다.");

    return await res.json(); // JSON 데이터를 반환
  } catch (error) {
    console.error("프로필 불러오기 실패:", error);
    return null; // 오류 발생 시 null 반환
  }
}

// 클라이언트 컴포넌트가 실행하면 -> CSR
// 서버 컴포넌트가 실행하면 -> SSR
