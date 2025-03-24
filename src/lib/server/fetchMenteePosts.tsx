export default async function fetchMenteePosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/search?category=MENTEE`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("멘티 게시글을 불러오지 못했습니다.");

    return await res.json();
  } catch (error) {
    console.error("게시글 불러오기 실패:", error);
    return null;
  }
}
