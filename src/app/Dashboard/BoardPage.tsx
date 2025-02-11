"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface Tag {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  author: string;
  tag: string;
  views: number;
  comments: number;
  createdAt: string;
}

interface BoardPageProps {
  initialTags: Tag[];
}

const BoardPage: React.FC<BoardPageProps> = ({ initialTags }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ "개발전체" 태그의 ID를 찾아서 기본 선택된 상태로 설정
  const defaultSelectedTag =
    initialTags.find((tag) => tag.name === "개발전체")?.id ?? null;
  const [selectedTags, setSelectedTags] = useState<number[]>(
    defaultSelectedTag ? [defaultSelectedTag] : []
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [tags] = useState<Tag[]>(initialTags);

  // ✅ 태그 선택 / 해제 기능
  const handleTagSelection = (tagId: number) => {
    setSelectedTags(
      (prevSelected) =>
        prevSelected.includes(tagId)
          ? prevSelected.filter((id) => id !== tagId) // 이미 선택된 태그면 제거
          : [...prevSelected, tagId] // 선택되지 않은 태그면 추가
    );
  };

  // ✅ 선택된 태그 ID 리스트를 백엔드로 보내서 게시글 필터링
  useEffect(() => {
    const fetchPosts = async () => {
      const searchByTagDto =
        selectedTags.length > 0 ? `?tagIds=${selectedTags.join(",")}` : "";

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/search${searchByTagDto}`
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
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* 검색 및 태그 필터 UI */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          {tags.map((tag) => (
            <TagButton
              key={tag.id}
              active={selectedTags.includes(tag.id)}
              onClick={() => handleTagSelection(tag.id)}
            >
              {tag.name}
            </TagButton>
          ))}
        </div>
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
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  태그
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  조회
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {post.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        댓글 {post.comments}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {post.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.views}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ✅ 태그 버튼 컴포넌트
const TagButton: React.FC<{
  children: string;
  active: boolean;
  onClick: () => void;
}> = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

export default BoardPage;
