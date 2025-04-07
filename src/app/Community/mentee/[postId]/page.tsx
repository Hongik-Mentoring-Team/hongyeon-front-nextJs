"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/** [변경사항: MentorPostDetail 코드와 동일하게, Post 인터페이스에 chatRoomId, closed, ... 추가] */
interface Comment {
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
  comments: Comment[];
  likeCount: number;
  capacity: number;
  currentApplicants: number;
  closed: boolean; // 모집 마감 여부
  chatRoomType: "PUBLIC" | "PRIVATE";
  owner: boolean;
  chatRoomId: number; // [변경사항: 채팅방이 개설되면 -1이 아닌 ID]
}

const MenteePostDetail = () => {
  const { postId } = useParams();
  const router = useRouter();

  // [멘티 기본 코드]
  const [nickname, setNickname] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  // [변경사항: Mentor 코드를 가져옴 → 채팅방 생성 및 이동 로직]
  const [isInitiating, setIsInitiating] = useState(false); // 채팅방 생성 중 여부
  const [canJoin, setCanJoin] = useState(""); // 채팅방 접근 확인 상태 ("", "true", "false", "checking")

  // ==========================================
  // [1] 게시글 API 호출 (기존 멘티 코드 유지)
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}`,
          { method: "GET", credentials: "include" }
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

  // ==========================================
  // [2] 지원하기 로직 (기존 멘티 코드 수정 → nickname 파라미터 포함)
  const handleApply = async () => {
    if (!postId) return;
    if (!nickname.trim()) {
      alert("채팅방에서 사용할 닉네임을 입력해주세요.");
      return;
    }
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1/post/${postId}/apply?nickname=${encodeURIComponent(nickname)}`,
        { method: "GET", credentials: "include" }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "지원 요청 실패");
      }
      alert("지원이 완료되었습니다!");
    } catch (error: unknown) {
      console.error("지원 요청 오류:", error);
  
  }
  };

  // ==========================================
  // [3] 댓글 작성 (멘티 코드 그대로)
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
      const { data }=await res.json();      

      setNewComment("");
      setPost((prev) => ({
        ...prev!,
        comments: [
          ...prev!.comments,
          {
            ...commentReqDto,
            commentId: data.commentId,
            owner: true,
            createdAt: new Date().toISOString(),
          }as Comment,
        ],
      }));
    } catch (error) {
      console.error("댓글 등록 오류:", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // ==========================================
  // [4] 댓글 수정/삭제 (멘티 코드 그대로)
  const handleEditComment = (commentId: number) => {
    setPost((prev) => ({
      ...prev!,
      comments: prev!.comments.map((c) =>
        c.commentId === commentId
          ? { ...c, editing: true, editedText: c.comment }
          : c
      ),
    }));
  };
  const handleCancelEdit = (commentId: number) => {
    setPost((prev) => ({
      ...prev!,
      comments: prev!.comments.map((c) =>
        c.commentId === commentId ? { ...c, editing: false } : c
      ),
    }));
  };
  const handleCommentChange = (commentId: number, newText: string) => {
    setPost((prev) => ({
      ...prev!,
      comments: prev!.comments.map((c) =>
        c.commentId === commentId ? { ...c, editedText: newText } : c
      ),
    }));
  };
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
        comments: prev!.comments.map((c) =>
          c.commentId === commentId
            ? { ...c, comment: updatedComment.editedText ?? c.comment, editing: false }
            : c
        ),
      }));
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };
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
        comments: prev!.comments.filter((c) => c.commentId !== commentId),
      }));
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // ==========================================
  // [5] 게시글 삭제 (멘티 코드 그대로)
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
      router.push("/Community/mentee");
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // ==========================================
  // [변경사항: Mentor 코드 → 채팅방 생성 로직 추가]
  const handleInitiateChat = async () => {
    if (!post) return;
    setIsInitiating(true);
    try {
      const chatInitiateDto = {
        roomName: post.title,
        postId: post.postId,
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chatRoom/initiate`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatInitiateDto),
        }
      );
      if (!res.ok) throw new Error("채팅방 생성 실패");

      const data = await res.json();
      const newRoomId = data.chatRoomId;

      setPost((prev) => prev && { ...prev, chatRoomId: newRoomId });
    } catch (error) {
      console.error("채팅방 생성 오류:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    } finally {
      setIsInitiating(false);
    }
  };

  // [변경사항: Mentor 코드 → 모집 마감 + chatRoomId=-1이면 채팅방 생성 자동화]
  useEffect(() => {
    if (post && post.closed && post.chatRoomId === -1 && !isInitiating) {
      handleInitiateChat();
    }
  }, [post, isInitiating]);

  // ==========================================
  // [변경사항: Mentor 코드 → 채팅방 진입 핸들러]
  const handleEnterChat = () => {
    if (post && post.chatRoomId !== -1) {
      router.push(`/chat/${post.chatRoomId}`);
    }
  };

  // ==========================================
  // [변경사항: Mentor 코드 → 채팅방 접근 권한 확인 로직]
  const CheckChatRoomAccess = async () => {
    try {
      setCanJoin("checking");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chatRoom/${post?.chatRoomId}/check-access`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("채팅방 접근 권한 확인실패");
      }

      const data = await response.json();
      setCanJoin(data.canJoin);
    } catch (error) {
      console.error("채팅방 접근 확인 오류", error);
    }
  };

  // ==========================================
  // 렌더링
  if (!post) {
    return <p className="text-center mt-10">게시글을 불러오는 중...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        작성자: {post.author} | {post.createdAt}
      </p>

      {/* 게시글 소유자면 수정/삭제 */}
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

      {/* 좋아요 수 */}
      <div className="flex items-center gap-4 text-gray-600 text-sm mt-4 mb-4">
        <p>👍 좋아요 {post.likeCount}</p>
      </div>

      {/* 채팅방 유형 */}
      <p className="text-sm font-bold mb-2">
        💬 채팅방 유형:{" "}
        {post.chatRoomType === "PUBLIC" ? "공개 채팅방" : "비공개 채팅방"}
      </p>

      <div className="border-t pt-4">
        <p className="text-lg">{post.content}</p>
      </div>

      {/* 모집 정보 */}
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

      {/* 닉네임 입력 + 지원하기 */}
      {!post.owner && (
        <div className="mt-6 flex items-center gap-2">
          <input
            type="text"
            placeholder="닉네임을 입력하세요..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="p-2 border rounded-md flex-1 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleApply}
            disabled={post.closed || !nickname.trim()}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              post.closed || !nickname.trim()
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {post.closed ? "모집이 마감되었습니다" : "지원하기"}
          </button>
        </div>
      )}

      {/* 모집 마감 & chatRoomId === -1 => 채팅방 생성 중 */}
      {post.closed && post.chatRoomId === -1 && (
        <p className="mt-4 text-blue-600 font-semibold">
          채팅방을 생성하고 있습니다 :)
        </p>
      )}

      {/* 채팅방 접근 로직 */}
      <div className="mt-6 flex flex-col items-center">
        {post.closed && post.chatRoomId !== -1 && canJoin === "" && (
          <button
            onClick={() => {
              CheckChatRoomAccess();
            }}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            멘토링 채팅방이 개설되었습니다
          </button>
        )}
        {canJoin !== "" && (
          <>
            {canJoin === "true" ? (
              <button
                onClick={handleEnterChat}
                className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                채팅방 입장하기
              </button>
            ) : canJoin === "false" ? (
              <p className="mt-4 text-gray-600 font-semibold">
                멘토링이 진행 중입니다
              </p>
            ) : (
              <p className="mt-4 text-blue-600 font-semibold">
                채팅방 접근 확인 중...
              </p>
            )}
          </>
        )}
      </div>

      {/* 댓글 목록 */}
      <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">💬 댓글</h2>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div
              key={comment.commentId}
              className="p-3 bg-white rounded-lg shadow mb-2"
            >
              <div className="flex justify-between items-center">
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

      {/* 댓글 입력창 */}
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
