"use client";

import React, { useState, useEffect } from "react";
import { getTags } from "@/lib/server/tags";
import { useRouter } from "next/navigation";
import Input from "@/app/(Components)/ui/Input";
import TagButton from "@/app/(Components)/ui/TagButton";
import Button from "@/app/(Components)/ui/Button";

interface Tag {
  id: number;
  name: string;
}

const WriteMentorPost = () => {
  const router = useRouter();

  // ✅ 입력값 상태
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [content, setContent] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
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

    const postCreateDTO = {
      title,
      tagIds: selectedTags,
      content,
      capacity,
      chatRoomType,
      category: "MENTOR", //MENTOR | MENTEE
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(postCreateDTO),
        }
      );

      if (!res.ok) throw new Error("게시글 등록 실패");

      alert("게시글이 성공적으로 등록되었습니다!");
      router.push("/Community/mentor"); // ✅ 게시판으로 이동
    } catch (error) {
      console.error("게시글 등록 오류:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full max-w-[95%] mx-auto py-4 px-2">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 헤더 영역 */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            멘토 게시글 작성
          </h1>
          <p className="text-white/80 mt-2">
            멘티들에게 도움을 줄 게시글을 작성해보세요
          </p>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-4 md:p-6 space-y-5">
          {/* 제목 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">제목</label>
            <Input
              type="text"
              placeholder="게시글 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 태그 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              게시글 태그
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagButton
                  key={tag.id}
                  selected={selectedTags.includes(tag.id)}
                  onClick={() => handleTagSelection(tag.id)}
                >
                  {tag.name}
                </TagButton>
              ))}
            </div>
          </div>

          {/* 본문 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">본문</label>
            <div className="rounded-xl border border-neutral-200 overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <textarea
                placeholder="멘티들에게 전달할 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 h-40 focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* 멘티 모집 인원 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              멘티 모집 인원
            </label>
            <Input
              type="number"
              min="1"
              max="20"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>

          {/* 게시글 유형 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              게시글 유형 선택
            </label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    value="PUBLIC"
                    checked={chatRoomType === "PUBLIC"}
                    onChange={() => setChatRoomType("PUBLIC")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      chatRoomType === "PUBLIC"
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {chatRoomType === "PUBLIC" && (
                      <div className="w-3 h-3 bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
                <span>공개용 채팅방</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    value="PRIVATE"
                    checked={chatRoomType === "PRIVATE"}
                    onChange={() => setChatRoomType("PRIVATE")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      chatRoomType === "PRIVATE"
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {chatRoomType === "PRIVATE" && (
                      <div className="w-3 h-3 bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
                <span>비공개용 채팅방</span>
              </label>
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="flex justify-end pt-4">
            <div className="flex gap-3">
              <Button
                onClick={() => router.back()}
                variant="secondary"
                size="md"
              >
                취소
              </Button>
              <Button onClick={handleSubmit} variant="primary" size="md">
                게시글 등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteMentorPost;
