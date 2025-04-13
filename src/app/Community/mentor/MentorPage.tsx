"use client";

import React, { useState, useEffect } from "react";
import { Search, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/app/(Components)/ui/Button";
import TagButton from "@/app/(Components)/ui/TagButton";
import Input from "@/app/(Components)/ui/Input";

interface Tag {
  id: number;
  name: string;
}

interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  tagId: number;
  createdAt: string;
}

interface MentorPageProps {
  initialTags: Tag[];
}

const MentorPage: React.FC<MentorPageProps> = ({ initialTags }) => {
  const router = useRouter();

  // ✅ "개발전체" 태그가 있으면 기본 선택
  const defaultTag = initialTags.find((tag) => tag.name === "개발전체");
  const [selectedTags, setSelectedTags] = useState<number[]>(
    defaultTag ? [defaultTag.id] : []
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags] = useState<Tag[]>(initialTags);
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

  // ✅ 선택된 태그 ID 리스트를 백엔드에 보내서 게시글 필터링
  useEffect(() => {
    const fetchPosts = async () => {
      const tagQuery =
        selectedTags.length > 0 ? `&tagIds=${selectedTags.join(",")}` : "";

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/search?category=MENTOR${tagQuery}`
        );
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, [selectedTags]);

  return (
    // 70px: navbarHeight에 맞게 내린거임
    <div className="flex w-full h-auto pt-[70px] bg-white">
      <div
        id="MentorContainer"
        className="flex flex-col w-full h-auto px-32 gap-8"
      >
        {/* 게시판 제목 */}
        <div
          id="MentorTitle"
          className="flex flex-col w-full h-auto my-5 gap-4 border border-gray-300 rounded-lg p-5 bg-white"
        >
          <h1 className="text-4xl font-bold">멘토 게시판</h1>
          <h3 className="text-2xl font-semibold">
            원하는 멘토에게 질문하세요.
          </h3>
        </div>

        {/* 태그, 검색, 작성하기 영역을 하나의 박스로 묶기 */}
        <div className="w-full border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
          {/* 태그 필터 */}
          <div
            id="MentorMenuBlock"
            className="flex flex-col w-full h-auto gap-3 mb-5"
          >
            <h2 id="MentorMenuTitle" className="text-2xl font-semibold">
              태그 선택
            </h2>
            <div
              id="MentorMenuTag"
              className="flex flex-wrap w-full h-auto py-2 gap-2"
            >
              {tags.map((tag) => (
                <TagButton
                  key={tag.id}
                  selected={selectedTags.includes(tag.id)}
                  onClick={() => handleTagSelection(tag.id)}
                  variant="primary"
                >
                  {tag.name}
                </TagButton>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-full h-px bg-gray-200 my-4"></div>

          {/* 검색창 & 작성하기 버튼 */}
          <div className="flex w-full items-center justify-between gap-4 pt-2">
            <div className="relative w-full sm:w-64">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-500 focus:border-primary focus:ring-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* ✅ 작성하기 버튼 (검색창과 같은 높이, 오른쪽 정렬) */}
            <Button
              variant="primary"
              icon={<PenLine size={16} />}
              onClick={() => router.push("/Community/mentor/writePost")}
            >
              작성하기
            </Button>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div
          id="MentorTextBoxContainer"
          className="flex flex-col w-full h-auto gap-3 py-2"
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <MentorTextBox
                key={post.postId}
                postId={post.postId} // ✅ postId 추가
                title={post.title}
                mainText={post.content}
                memberID={post.author}
                date={post.createdAt}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">게시글이 없습니다.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/Community/mentor/writePost")}
              >
                첫 게시글 작성하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ 게시글 블록 컴포넌트 (✅ 게시글 클릭 시 상세 페이지 이동)
const MentorTextBox: React.FC<{
  postId: number; // ✅ postId 추가
  title: string;
  mainText: string;
  memberID: string;
  date: string;
}> = ({ postId, title, mainText, memberID, date }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/Community/mentor/${postId}`)} // ✅ 클릭 시 이동
      className="flex flex-col justify-between min-w-[750px] h-[150px] border border-gray-300 rounded-xl bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-all hover:shadow-sm"
    >
      <h2 className="w-auto text-gray-800 text-2xl font-bold">{title}</h2>
      <p className="w-full text-gray-700 line-clamp-2">{mainText}</p>
      <div className="flex w-full justify-between items-center text-gray-500 text-sm">
        <div className="flex items-center">
          <span className="font-medium text-primary">{memberID}</span>
        </div>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default MentorPage;
