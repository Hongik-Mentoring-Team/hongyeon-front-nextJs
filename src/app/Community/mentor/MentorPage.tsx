"use client";

import React, { useState, useEffect } from "react";
import { CircleUserRound, Search } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className="flex w-full h-auto">
      <div
        id="MentorContainer"
        className="flex flex-col w-full h-auto px-16 lg:px-32 gap-12"
      >
        {/* 게시판 제목 */}
        <div
          id="MentorTitle"
          className="flex flex-col w-full h-auto my-5 gap-4"
        >
          <h1 className="text-4xl font-bold">멘토 게시판</h1>
          <h3 className="text-2xl font-semibold">
            원하는 멘토에게 질문하세요.
          </h3>
        </div>

        {/* 태그 필터 */}
        <div
          id="MentorMenuBlock"
          className="flex flex-col w-full h-auto my-4 gap-1 overflow-hidden"
        >
          <h2 id="MentorMenuTitle" className="text-2xl font-semibold">
            태그 선택
          </h2>
          <div
            id="MentorMenuTag"
            className="flex animate-infiniteSlide whitespace-nowrap gap-1"
          >
            {tags.map((tag) => (
              <MentorTextTag
                key={tag.id}
                tag={tag}
                active={selectedTags.includes(tag.id)}
                onClick={() => handleTagSelection(tag.id)}
              />
            ))}

            {tags.map((tag) => (
              <MentorTextTag
                key={`copy-${tag.id}`}
                tag={tag}
                active={selectedTags.includes(tag.id)}
                onClick={() => handleTagSelection(tag.id)}
              />
            ))}
          </div>
        </div>

        {/* 검색창 & 작성하기 버튼 */}
        <div className="flex w-full items-center justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* ✅ 작성하기 버튼 (검색창과 같은 높이, 오른쪽 정렬) */}
          <button
            onClick={() => router.push("/Community/mentor/writePost")}
            className="ml-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg transition-colors"
          >
            작성하기
          </button>
        </div>

        {/* 게시글 목록 */}
        <div
          id="MentorTextBoxContainer"
          className="flex flex-col w-full h-auto gap-2"
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
            <p className="text-center text-gray-500">게시글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ 태그 버튼 컴포넌트
const MentorTextTag: React.FC<{
  tag: Tag;
  active: boolean;
  onClick: () => void;
}> = ({ tag, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`}
  >
    {tag.name}
  </button>
);

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
      className="flex flex-col justify-between min-w-[750px] h-[150px] border-2 rounded-lg bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <h2 className="w-auto text-gray-800 text-2xl font-bold">{title}</h2>
      <p className="w-[300px] text-gray-700 line-clamp-1">{mainText}</p>
      <div className="flex w-full justify-between items-center text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <CircleUserRound size={20} />
          <span>{memberID}</span>
        </div>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default MentorPage;
