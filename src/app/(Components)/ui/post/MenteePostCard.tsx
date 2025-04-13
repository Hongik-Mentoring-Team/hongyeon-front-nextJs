// 변경사항: 멘티 게시글 공통 컴포넌트 추가
// 업데이트: 현대적인 디자인 요소 적용, MentorTextBox와 스타일 통일
"use client";

import { useRouter } from "next/navigation";
import { MenteePostCardProps } from "./MenteePostCardProps";

const MenteePostCard: React.FC<MenteePostCardProps> = ({
  postId,
  title,
  content,
  memberId,
  createdAt,
  author,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/Community/mentee/${postId}`)}
      className="flex flex-col justify-between min-w-[750px] h-[150px] border-2 rounded-xl bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-all hover:shadow-sm"
    >
      <h2 className="w-auto text-gray-800 text-2xl font-bold">{title}</h2>
      <p className="w-full text-gray-700 line-clamp-2">{content}</p>
      <div className="flex w-full justify-between items-center text-gray-500 text-sm">
        <div className="flex items-center">
          <span className="font-medium text-gray-700">{author}</span>
        </div>
        <span>{createdAt}</span>
      </div>
    </div>
  );
};

export default MenteePostCard;
