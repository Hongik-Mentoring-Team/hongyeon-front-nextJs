"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface CommentResDto {
  commentId: number;
  comment: string;
  postId: number;
  memberId: number;
  createdAt: string;
  owner: boolean;
  editing?: boolean;
  editedText?: string;
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
  closed: boolean; // ✅ 모집 마감 여부
  owner: boolean;
  chatRoomId: number;
}

const MentorPostDetail = () => {
  const router = useRouter();

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

  // ✅ 댓글 수정 상태 변경
  const handleEditComment = (commentId: number) => {
    setPost((prev) => ({
      ...prev!,
      comments: prev!.comments.map((comment) =>
        comment.commentId === commentId
          ? { ...comment, editing: true, editedText: comment.comment }
          : comment
      ),
    }));
  };

  // ✅ 수정 중 취소
  const handleCancelEdit = (commentId: number) => {
    setPost((prev) => ({
      ...prev!,
      comments: prev!.comments.map((comment) =>
        comment.commentId === commentId
          ? { ...comment, editing: false }
          : comment
      ),
    }));
  };

  // ✅ 수정 중 내용 변경
  const handleCommentChange = (commentId: number, newText: string) => {
    setPost((prev) => ({
      ...prev!,
      comments: prev!.comments.map((comment) =>
        comment.commentId === commentId
          ? { ...comment, editedText: newText }
          : comment
      ),
    }));
  };

  // ✅ 댓글 저장 (백엔드 PATCH 요청)
  const handleSaveComment = async (commentId: number) => {
    const updatedComment = post!.comments.find(
      (c) => c.commentId === commentId
    );
    if (!updatedComment) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            comment: updatedComment.editedText,
            postId: updatedComment.postId,
          }),
        }
      );

      if (!res.ok) throw new Error("댓글 수정 실패");

      setPost((prev) => ({
        ...prev!,
        comments: prev!.comments.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, comment: updatedComment.editedText, editing: false }
            : comment
        ),
      }));
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 댓글 삭제 핸들러 (백엔드 DELETE 요청)
  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = confirm("정말로 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "댓글 삭제 실패");
      }

      // ✅ 삭제된 댓글을 화면에서 제거
      setPost((prev) => ({
        ...prev!,
        comments: prev!.comments.filter(
          (comment) => comment.commentId !== commentId
        ),
      }));

      alert("댓글이 삭제되었습니다.");
    } catch (error: any) {
      console.error("댓글 삭제 오류:", error);
      alert(`댓글 삭제 실패: ${error.message}`);
    }
  };

  {
    /* ✅ 게시글 삭제 핸들러 */
  }
  const handleDelete = async () => {
    if (!postId) return;

    const confirmDelete = confirm("정말로 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "게시글 삭제 실패");
      }

      alert("게시글이 삭제되었습니다.");
      router.push("/Community/mentor"); // ✅ 삭제 후 게시판으로 이동
    } catch (error: any) {
      console.error("게시글 삭제 오류:", error);
      alert(`삭제 실패: ${error.message}`);
    }
  };

  {
    /* 채팅방 개설 핸들러 */
  }
  const handleEnterChat = () => {
    if (chatRoomId) {
      router.push(`/chat/${chatRoomId}`);
    }
  };

  if (!post)
    return <p className="text-center mt-10"> 게시글을 불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {/* ✅ 제목 및 메타정보 (수정/삭제 버튼 포함) */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 text-sm">
          작성자: {post.author} | {post.createdAt}
        </p>

        {/* ✅ 게시글 소유자인 경우 수정/삭제 버튼 표시 */}
        {post.owner && (
          <div className="flex gap-2">
            <button
              className="bg-transparent text-gray-500 text-sm hover:text-gray-700 transition-colors"
              onClick={() =>
                router.push(`/Community/mentor/editPost/${post.postId}`)
              }
            >
              수정
            </button>
            <button
              className="bg-transparent text-gray-500 text-sm hover:text-gray-700 transition-colors"
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        )}
      </div>
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
            post.closed ? "text-red-600" : "text-green-600"
          }`}
        >
          {post.closed ? "❌ 모집 마감" : "✅ 모집 중"}
        </p>
      </div>

      {/* ✅ 지원하기 버튼 */}
      <div className="mt-6 flex flex-col items-center">
        {/* ✅ 게시글 작성자인 경우 현재 지원자 수 표시 */}
        {post.owner ? (
          <p className="text-gray-600 text-sm mb-2">
            현재 지원자 수:{" "}
            <span className="font-bold">{post.currentApplicants}</span> 명
          </p>
        ) : (
          <button
            onClick={handleApply}
            disabled={post.closed}
            className={`w-full py-3 rounded-md font-medium transition-colors ${
              post.closed
                ? "bg-red-500 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {post.closed ? "모집이 마감되었습니다" : "지원하기"}
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center">
        {/* ✅ 모집이 마감되었을 때 채팅방 버튼 표시 */}
        {post.closed && chatRoomId && (
          <button
            onClick={handleEnterChat}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            멘토링 채팅방이 개설되었습니다
          </button>
        )}
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
              <div className="flex justify-between items-center">
                {/* ✅ 수정 중이면 입력 필드 표시 */}
                {comment.editing ? (
                  <input
                    type="text"
                    value={comment.editedText}
                    onChange={(e) =>
                      handleCommentChange(comment.commentId, e.target.value)
                    }
                    className="flex-1 p-1 border border-gray-300 rounded-md text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-800">{comment.comment}</p>
                )}

                {/* ✅ 댓글 작성자인 경우에만 수정/삭제 버튼 표시 */}
                {comment.owner && (
                  <div className="flex gap-2">
                    {comment.editing ? (
                      <>
                        <button
                          className="bg-transparent text-blue-500 text-xs hover:text-blue-700 transition-colors"
                          onClick={() => handleSaveComment(comment.commentId)}
                        >
                          저장
                        </button>
                        <button
                          className="bg-transparent text-gray-500 text-xs hover:text-gray-700 transition-colors"
                          onClick={() => handleCancelEdit(comment.commentId)}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-transparent text-gray-500 text-xs hover:text-gray-700 transition-colors"
                          onClick={() => handleEditComment(comment.commentId)}
                        >
                          수정
                        </button>
                        <button
                          className="bg-transparent text-gray-500 text-xs hover:text-gray-700 transition-colors"
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">{comment.createdAt}</span>
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
