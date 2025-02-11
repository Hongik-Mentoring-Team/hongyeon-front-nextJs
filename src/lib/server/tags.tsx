export const getTags = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tags`,
      {
        cache: "force-cache", // 정적 데이터로 캐싱
      }
    );

    if (!res.ok) {
      throw new Error("태그 데이터를 불러오지 못했습니다.");
    }

    return res.json();
  } catch (error) {
    console.error("태그 데이터 불러오기 실패:", error);
    return [];
  }
};
