// 변경사항: 멘티 게시글 공통 컴포넌트 추가
"use client";

import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import { MenteePostCardProps } from "./MenteePostCardProps";

// interface MenteePostCardProps {
//   postId: number;
//   title: string;
//   content: string;
//   author: string;
//   createdAt: string;
// }



const MenteePostCard: React.FC<MenteePostCardProps> = ({
  // key,
  postId,
  title,
  content,
  memberId,
  createdAt,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/Community/mentee/${postId}`)}  // ✅ 게시글 클릭 시 해당 게시글 페이지로 이동
      className="flex flex-col justify-between min-w-[750px] h-[150px] border-2 rounded-lg bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <h2 className="w-auto text-gray-800 text-2xl font-bold">{title}</h2>
      <p className="w-[300px] text-gray-700 line-clamp-1">{content}</p>
      <div className="flex w-full justify-between items-center text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <CircleUserRound size={20} />
          <span>{memberId}</span>
        </div>
        <span>{createdAt}</span>
      </div>
    </div>
  );
};

export default MenteePostCard;
