"use client";

import { useEffect, useState } from "react";
// [변경사항: useParams, useRouter를 한 줄로 가져오도록 수정]
// 원본: import { useParams, useRouter } from "next/navigation";
import { useParams, useRouter } from "next/navigation";

// [변경사항: Comment 인터페이스는 1번 코드(MentorPostDetail)의 CommentResDto와 동일한 역할 수행]
interface Comment {
  commentId: number;
  comment: string;
  postId: number;
  memberId: number;
  createdAt: string;
  owner: boolean;
  editing?: boolean; // [변경사항: 댓글 수정 모드 여부]
  editedText?: string; // [변경사항: 수정 중인 댓글 임시 텍스트]
}

// [변경사항: 1번 코드와 동일하게 Post 인터페이스 확장]
interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
  comments: Comment[];
  likeCount: number; // [변경사항: 좋아요 수 추가]
  capacity: number; // [변경사항: 모집 인원 추가]
  currentApplicants: number; // [변경사항: 현재 지원자 수 추가]
  closed: boolean; // [변경사항: 모집 마감 여부 추가]
  chatRoomType: "PUBLIC" | "PRIVATE";
  owner: boolean;
}

const MenteePostDetail = () => {
  const { postId } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

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

  // [변경사항: 1번 코드와 동일하게 "지원하기" 로직 추가]
  const handleApply = async () => {
    if (!postId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}/apply`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "지원 요청 실패");
      }

      alert("지원이 완료되었습니다!");
    } catch (error: any) {
      console.error("지원 요청 오류:", error);
      alert(`!${error.message}`);
    }
  };

  // ✅ 게시글 삭제 핸들러
  const handleDeletePost = async () => {
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

      if (!res.ok) throw new Error("게시글 삭제 실패");

      alert("게시글이 삭제되었습니다.");
      // [변경사항: 1번 코드와 달리 mentee 경로로 이동]
      router.push("/Community/mentee");
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // ✅ 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const commentReqDto = { comment: newComment, postId: Number(postId) };

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

      setNewComment("");

      //즉시 새 댓글을 추가]
      setPost((prev) => ({
        ...prev!,
        comments: [
          ...prev!.comments,
          {
            ...commentReqDto,
            commentId: Date.now(), // 임시 ID
            owner: true,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
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

  // ✅ 댓글 삭제 핸들러
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

      if (!res.ok) throw new Error("댓글 삭제 실패");

      setPost((prev) => ({
        ...prev!,
        comments: prev!.comments.filter(
          (comment) => comment.commentId !== commentId
        ),
      }));

      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!post)
    return <p className="text-center mt-10">게시글을 불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        작성자: {post.author} | {post.createdAt}
      </p>

      {/* [변경사항: 1번 코드와 동일하게, 게시글 소유자이면 '수정'/'삭제' 버튼 표시] */}
      {post.owner && (
        <div className="flex gap-2">
          <button
            className="text-blue-500"
            onClick={() =>
              router.push(`/Community/mentee/editPost/${post.postId}`)
            }
          >
            수정
          </button>
          <button className="text-red-500" onClick={handleDeletePost}>
            삭제
          </button>
        </div>
      )}

      {/* [변경사항: 좋아요 수 표시 추가] */}
      <div className="flex items-center gap-4 text-gray-600 text-sm mt-4 mb-4">
        <p>👍 좋아요 {post.likeCount}</p>
      </div>

      {/* ✅ 채팅방 유형 */}
      <p className="text-sm font-bold mb-2">
        💬 채팅방 유형:{" "}
        {post.chatRoomType === "PUBLIC" ? "공개 채팅방" : "비공개 채팅방"}
      </p>

      <div className="border-t pt-4">
        <p className="text-lg">{post.content}</p>
      </div>

      {/* [변경사항: 모집 정보 표시 + 지원하기 버튼 로직 추가] */}
      <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">모집 정보</h2>
        <p>📌 모집 인원: {post.capacity}명</p>
        <p>📝 현재 지원자: {post.currentApplicants}명</p>
        <p className="font-bold">
          {post.chatRoomType === "PUBLIC" ? "공개 채팅방" : "비공개 채팅방"}
        </p>
        <p
          className={`font-bold ${
            post.closed ? "text-red-600" : "text-green-600"
          }`}
        >
          {post.closed ? "❌ 모집 마감" : "✅ 모집 중"}
        </p>
      </div>

      {/* [변경사항: 1번 코드처럼 '지원하기' 버튼 추가 / 게시글 소유자에게는 지원 버튼 노출 X] */}
      <div className="mt-6 flex flex-col items-center">
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

      {/* [변경사항: 기존 2번 코드에는 댓글 목록이 보이지 않았으므로, 1번 코드처럼 댓글 목록 UI 추가] */}
      <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">💬 댓글</h2>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div
              key={comment.commentId}
              className="p-3 bg-white rounded-lg shadow mb-2"
            >
              <div className="flex justify-between items-center">
                {/* 수정 중인 경우, 인풋 필드로 표시 */}
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
          className="flex-1 p-2 border rounded-md"
        />
        <button
          onClick={handleCommentSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default MenteePostDetail;
