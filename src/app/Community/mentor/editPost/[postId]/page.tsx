"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Tag {
  id: number;
  name: string;
}

const EditMentorPost = () => {
  const { postId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]); // ✅ 빈 배열로 초기화
  const [capacity, setCapacity] = useState<number>(1);
  const [tags, setTags] = useState<Tag[]>([]);

  // ✅ 기존 게시글 정보 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const data = await res.json();

        setTitle(data.title);
        setContent(data.content);
        setSelectedTags(
          data.tags.map((tag: { tagId: number }) => tag.tagId) || []
        ); // ✅ undefined 방지
        setCapacity(data.capacity);
      } catch (error) {
        console.error("게시글 로딩 오류:", error);
      }
    };

    fetchPost();
  }, [postId]);

  // ✅ 태그 목록 불러오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tags`
        );
        if (!res.ok) throw new Error("태그 데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.error("태그 데이터 불러오기 실패:", error);
      }
    };

    fetchTags();
  }, []);

  // ✅ 태그 선택 / 해제 기능 (다중 선택)
  const handleTagSelection = (tagId: number) => {
    setSelectedTags(
      (prev) =>
        prev?.includes(tagId)
          ? prev.filter((id) => id !== tagId) // 선택 해제
          : [...prev, tagId] // 선택 추가
    );
  };

  // ✅ 게시글 수정 요청
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }

    const updatedPost = {
      title,
      content,
      tagIds: selectedTags,
      capacity,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedPost),
        }
      );

      if (!res.ok) throw new Error("게시글 수정 실패");

      alert("게시글이 수정되었습니다!");
      router.push(`/Community/mentor/${postId}`); // ✅ 수정 후 원래 페이지로 이동
    } catch (error) {
      console.error("게시글 수정 오류:", error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">게시글 수정</h1>

      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
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
                selectedTags?.includes(tag.id) // ✅ undefined 방지
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
          placeholder="멘티들에게 전달할 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-md h-40 focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* 모집 인원 입력 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">모집 인원</label>
        <input
          type="number"
          min="1"
          max="20"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 게시글 수정 버튼 */}
      <button
        onClick={handleUpdate}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        수정 완료
      </button>
    </div>
  );
};

export default EditMentorPost;
