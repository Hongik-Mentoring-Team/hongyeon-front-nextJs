"use client";

// 멘티의 글 작성 페이지지
import React, { useState, useEffect } from "react";
import MenteeLayout from "./MenteeLayout"; // ✅ 레이아웃 파일 분리
import { MenteePostCardProps } from "@/app/(Components)/ui/post/MenteePostCardProps";

interface Tag {
  id: number;
  name: string;
}

// interface Post {
//   postId: number;
//   title: string;
//   content: string;
//   author: string;
//   tagId: number;
//   createdAt: string;
// }

interface MenteePageProps {
  initialTags: Tag[];
}

const MenteePage: React.FC<MenteePageProps> = ({ initialTags }) => {
  // ✅ "개발전체" 태그가 있으면 기본 선택
  const defaultTag = initialTags.find((tag) => tag.name === "개발전체");
  const [selectedTags, setSelectedTags] = useState<number[]>(
    defaultTag ? [defaultTag.id] : []
  );
  const [posts, setPosts] = useState<MenteePostCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

  // ✅ 태그 선택 / 해제 기능
  const handleTagSelection = (tagId: number) => {
    setSelectedTags(
      (prevSelected) =>
        prevSelected.includes(tagId)
          ? prevSelected.filter((id) => id !== tagId) // 이미 선택된 태그면 제거
          : [...prevSelected, tagId] // 선택되지 않은 태그면 추가
    );
  };

  // ✅ 카테고리/태그 별 게시글 조회
  useEffect(() => {
    const fetchPosts = async () => {
      const tagQuery =
        selectedTags.length > 0 ? `&tagIds=${selectedTags.join(",")}` : "";

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/search?category=MENTEE${tagQuery}`
        );
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, [selectedTags]);

  return (
    <div className="flex w-full h-full justify-center">
      <MenteeLayout
        tags={initialTags}
        posts={posts}
        selectedTags={selectedTags}
        handleTagSelection={handleTagSelection}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default MenteePage;
