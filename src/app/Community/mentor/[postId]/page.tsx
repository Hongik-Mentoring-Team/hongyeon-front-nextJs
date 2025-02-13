"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface CommentResDto {
  commentId: number;
  comment: string;
  postId: number;
  memberId: number;
  createdAt: string;
}

interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
  comments: CommentResDto[]; // ✅ 댓글 목록
  likeCount: number; // ✅ 좋아요 수
  capacity: number; // ✅ 모집 인원
  chatRoomType: "PUBLIC" | "PRIVATE"; // ✅ 채팅방 유형
  currentApplicants: number; // ✅ 현재 지원 인원
  isClosed: boolean; // ✅ 모집 마감 여부
}

const MentorPostDetail = () => {
  const { postId } = useParams(); // 경로변수 가져오기
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState(""); // ✅ 댓글 입력 상태

  // ✅ 게시글 API 호출
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("게시글을 불러올 수 없습니다");
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("게시글 로딩 오류", error);
      }
    };

    fetchPost();
  }, [postId]);

  // ✅ "지원하기" 버튼 핸들러
  const handleApply = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}/apply`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        // ✅ 서버 응답 파싱
        const errorData = await res.json();
        throw new Error(errorData.message || "지원 요청 실패"); // 에러 코드가 있으면 출력
      }

      alert("지원이 완료되었습니다!");
    } catch (error: any) {
      console.error("지원 요청 오류:", error);
      alert(`!${error.message}`);
    }
  };

  // ✅ 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const commentReqDto = {
      comment: newComment,
      postId: Number(postId),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(commentReqDto),
        }
      );

      if (!res.ok) throw new Error("댓글 등록 실패");

      setNewComment(""); // ✅ 입력 필드 초기화

      // ✅ 댓글 목록 즉시 업데이트
      const updatedPost = {
        ...post,
        comments: [...post!.comments, commentReqDto],
      };
      setPost(updatedPost as Post);
    } catch (error) {
      console.error("댓글 등록 오류:", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  if (!post)
    return <p className="text-center mt-10"> 게시글을 불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      {/* ✅ 제목 및 메타정보 */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-2">
        작성자: {post.author} | {post.createdAt}
      </p>

      {/* ✅ 좋아요 수 표시 */}
      <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
        <p>👍 좋아요 {post.likeCount}</p>
      </div>

      {/* ✅ 본문 */}
      <div className="border-t pt-4">
        <p className="text-lg">{post.content}</p>
      </div>

      {/* ✅ 모집 정보 */}
      <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">모집 정보</h2>
        <p>📌 모집 인원: {post.capacity}명</p>
        <p>📝 현재 지원자: {post.currentApplicants}명</p>
        <p>
          💬 채팅방 유형:{" "}
          <span
            className={`font-bold ${
              post.chatRoomType === "PUBLIC" ? "text-green-600" : "text-red-600"
            }`}
          >
            {post.chatRoomType === "PUBLIC" ? "공개 채팅방" : "비공개 채팅방"}
          </span>
        </p>
        <p
          className={`font-bold ${
            post.isClosed ? "text-red-600" : "text-green-600"
          }`}
        >
          {post.isClosed ? "❌ 모집 마감" : "✅ 모집 중"}
        </p>
      </div>

      {/* ✅ 지원하기 버튼 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleApply}
          disabled={post.isClosed}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            post.isClosed
              ? "bg-red-500 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {post.isClosed ? "모집이 마감되었습니다" : "지원하기"}
        </button>
      </div>

      {/* ✅ 댓글 리스트 */}
      <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">💬 댓글</h2>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div
              key={comment.commentId}
              className="p-3 bg-white rounded-lg shadow mb-2"
            >
              <p className="text-sm text-gray-800">{comment.comment}</p>
              <span className="text-xs text-gray-500">
                작성일: {comment.createdAt}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">아직 댓글이 없습니다.</p>
        )}
      </div>

      {/* ✅ 댓글 입력창 */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCommentSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default MentorPostDetail;
