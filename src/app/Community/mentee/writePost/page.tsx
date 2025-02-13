"use client";

import React, { useState, useEffect } from "react";
import { getTags } from "@/lib/server/tags";
import { useRouter } from "next/navigation";

interface Tag {
  id: number;
  name: string;
}

const WriteMenteePost = () => {
  const router = useRouter();

  // ✅ 입력값 상태
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [content, setContent] = useState("");
  const [chatRoomType, setChatRoomType] = useState<"PUBLIC" | "PRIVATE">(
    "PUBLIC"
  );

  // ✅ 태그 목록 (서버에서 가져옴)
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await getTags();
      setTags(fetchedTags);
    };

    fetchTags();
  }, []);

  // ✅ 태그 선택 / 해제 기능 (다중 선택)
  const handleTagSelection = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // ✅ 게시글 등록 핸들러
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }

    const postData = {
      title,
      tagIds: selectedTags,
      content,
      chatRoomType,
      category: "MENTEE", // ✅ 멘티 게시글임을 나타냄
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(postData),
        }
      );

      if (!res.ok) throw new Error("게시글 등록 실패");

      alert("게시글이 성공적으로 등록되었습니다!");
      router.push("/Community/mentee"); // ✅ 게시판으로 이동
    } catch (error) {
      console.error("게시글 등록 오류:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">멘티 게시글 작성</h1>

      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">제목</label>
        <input
          type="text"
          placeholder="게시글 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 태그 선택 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">게시글 태그</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`px-4 py-2 rounded-md border ${
                selectedTags.includes(tag.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleTagSelection(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* 본문 입력 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">본문</label>
        <textarea
          placeholder="멘토들에게 전달할 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-md h-40 focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* 게시글 유형 선택 */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          게시글 유형 선택
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="PUBLIC"
              checked={chatRoomType === "PUBLIC"}
              onChange={() => setChatRoomType("PUBLIC")}
            />
            공개용 채팅방
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="PRIVATE"
              checked={chatRoomType === "PRIVATE"}
              onChange={() => setChatRoomType("PRIVATE")}
            />
            비공개용 채팅방
          </label>
        </div>
      </div>

      {/* 등록 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        게시글 등록
      </button>
    </div>
  );
};

export default WriteMenteePost;
