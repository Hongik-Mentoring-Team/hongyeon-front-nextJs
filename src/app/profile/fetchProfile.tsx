"use server";

export default async function fetchProfile() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/members/me/socialid"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const text = await response.text();
    console.log(text);
    // 프로필 데이터를 처리하는 로직 추가
  } catch (error) {
    console.error("Fetch profile failed:", error);
  }
}
