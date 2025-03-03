// src/app/Dashboard/page.tsx
import BoardPage from "./BoardPage";
import { getTags } from "@/lib/server/tags";

export default async function DashboardPage() {
  const tags = await getTags(); // 서버에서 태그 가져오기

  return <BoardPage />;
}
