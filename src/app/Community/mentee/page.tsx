import { getTags } from "@/lib/server/tags"; // ✅ 서버 함수 불러오기
import MenteePage from "./MenteePage";

export default async function CommunityPage() {
  const tags = await getTags(); // ✅ 서버에서 태그 데이터 가져오기
  return <MenteePage initialTags={tags} />; // ✅ 데이터를 클라이언트 컴포넌트로 전달
}
