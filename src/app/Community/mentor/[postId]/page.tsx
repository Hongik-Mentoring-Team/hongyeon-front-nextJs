"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Input from "@/app/(Components)/ui/Input";
import Button from "@/app/(Components)/ui/Button";
import {
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  Users,
  User,
  Calendar,
  Lock,
  Unlock,
} from "lucide-react";

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
  chatRoomId: number; // 초기값이 -1이면 채팅방은 미개설 상태
}

const MentorPostDetail = () => {
  const router = useRouter();

  const { postId } = useParams(); // 경로변수 가져오기
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState(""); // ✅ 댓글 입력 상태
  const [isInitiating, setIsInitiating] = useState(false); //채팅방 생성중
  const [nickname, setNickname] = useState(""); //사용자 닉네임
  const [canJoin, setCanJoin] = useState("");

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
    if (!nickname.trim()) {
      alert("채팅방에서 사용할 닉네임을 입력해주세요");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}/apply?nickname=${nickname}`,
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
    } catch (error: unknown) {
      console.error("지원 요청 오류:", error);
      alert(`!${error instanceof Error ? error.message : "알 수 없는 오류"}`);
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
            ? {
                ...comment,
                comment: updatedComment.editedText ?? comment.comment,
                editing: false,
              }
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
    } catch (error: unknown) {
      console.error("댓글 삭제 오류:", error);
      alert(
        `댓글 삭제 실패: ${
          error instanceof Error ? error.message : "오류 타입 확인 불가"
        }`
      );
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
    } catch (error: unknown) {
      console.error("게시글 삭제 오류:", error);
      alert(
        `삭제 실패: ${
          error instanceof Error ? error.message : "오류 타입 확인 불가"
        }`
      );
    }
  };

  // ✅ 채팅방 생성 API 호출 함수
  const handleInitiateChat = async () => {
    if (!post) return;
    setIsInitiating(true);
    try {
      // 백엔드로 보낼 DTO
      const chatInitiateDto = {
        roomName: post.title, // 채팅방 이름 예시
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

      // 채팅방 ID 수신
      const data = await res.json();
      const newRoomId = data.chatRoomId; // 백엔드에서 반환하는 chatRoomId

      // post 상태 업데이트
      setPost((prev) => prev && { ...prev, chatRoomId: newRoomId });
    } catch (error) {
      console.error("채팅방 생성 오류:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    } finally {
      setIsInitiating(false);
    }
  };

  // ✅ 모집이 마감되고 chatRoomId === -1인 경우 자동으로 chatRoomInit 호출
  useEffect(() => {
    if (post && post.closed && post.chatRoomId === -1 && !isInitiating) {
      handleInitiateChat();
    }
  }, [post, isInitiating]);

  {
    /* 채팅방 진입 핸들러 */
  }
  const handleEnterChat = () => {
    if (post && post.chatRoomId !== -1) {
      router.push(`/chat/${post.chatRoomId}`);
    }
  };

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

  if (!post)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-40 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-[95%] mx-auto py-4 px-2 pt-[20px]">
      {/* Back button */}
      <button
        onClick={() => router.push("/Community/mentor")}
        className="flex items-center text-gray-600 hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" />
        <span>게시판으로 돌아가기</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <User size={18} className="mr-2 opacity-80" />
              <span className="text-white/90">{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 opacity-80" />
              <span className="text-white/80 text-sm">{post.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Action buttons */}
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <ThumbsUp size={14} className="mr-1" />
                {post.likeCount}
              </span>
              {post.chatRoomType === "PUBLIC" ? (
                <span className="ml-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Unlock size={14} className="mr-1" />
                  공개 채팅방
                </span>
              ) : (
                <span className="ml-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Lock size={14} className="mr-1" />
                  비공개 채팅방
                </span>
              )}
              {post.closed ? (
                <span className="ml-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  모집 마감
                </span>
              ) : (
                <span className="ml-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  모집 중
                </span>
              )}
            </div>

            {/* Edit/Delete buttons */}
            {post.owner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/Community/mentor/editPost/${post.postId}`)
                  }
                >
                  수정
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          {/* Recruitment info */}
          <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h2 className="text-lg font-bold mb-3 text-gray-800">모집 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <Users size={18} className="text-primary mr-2" />
                <span className="text-gray-700">
                  모집 인원:{" "}
                  <span className="font-medium">{post.capacity}명</span>
                </span>
              </div>
              <div className="flex items-center">
                <User size={18} className="text-primary mr-2" />
                <span className="text-gray-700">
                  현재 지원자:{" "}
                  <span className="font-medium">
                    {post.currentApplicants}명
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Apply section */}
          {!post.owner && (
            <div className="mt-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-3">멘토링 신청</h3>
                <div className="flex gap-3">
                  <div className="flex-grow">
                    <Input
                      type="text"
                      placeholder="채팅방에서 사용할 닉네임을 입력하세요"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleApply}
                    disabled={post.closed || !nickname.trim()}
                  >
                    {post.closed ? "모집 마감됨" : "지원하기"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Chat information */}
          {post.closed && post.chatRoomId === -1 && (
            <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-700 flex items-center">
              <MessageCircle size={18} className="mr-2" />
              <p>채팅방을 생성하고 있습니다</p>
            </div>
          )}

          {/* Chat room access */}
          {post.closed && post.chatRoomId !== -1 && (
            <div className="mt-6">
              {canJoin === "" && (
                <Button
                  variant="primary"
                  onClick={CheckChatRoomAccess}
                  className="w-full"
                >
                  멘토링 채팅방이 개설되었습니다
                </Button>
              )}

              {canJoin === "true" && (
                <Button
                  variant="primary"
                  onClick={handleEnterChat}
                  className="w-full"
                >
                  채팅방 입장하기
                </Button>
              )}

              {canJoin === "false" && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-700 flex items-center justify-center">
                  <p className="font-medium">멘토링이 진행 중입니다</p>
                </div>
              )}

              {canJoin === "checking" && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-700 flex items-center justify-center">
                  <p className="font-medium">채팅방 접근 확인 중...</p>
                </div>
              )}
            </div>
          )}

          {/* Comments section */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="flex items-center text-lg font-bold mb-4 text-gray-800">
              <MessageCircle size={18} className="mr-2" />
              댓글 ({post.comments.length})
            </h2>

            {/* Comment list */}
            <div className="space-y-4 mb-6">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      {comment.editing ? (
                        <Input
                          type="text"
                          value={comment.editedText}
                          onChange={(e) =>
                            handleCommentChange(
                              comment.commentId,
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                      ) : (
                        <p className="text-gray-800">{comment.comment}</p>
                      )}

                      {/* Comment actions */}
                      {comment.owner && (
                        <div className="flex gap-2 ml-3">
                          {comment.editing ? (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  handleSaveComment(comment.commentId)
                                }
                              >
                                저장
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCancelEdit(comment.commentId)
                                }
                              >
                                취소
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditComment(comment.commentId)
                                }
                              >
                                수정
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteComment(comment.commentId)
                                }
                              >
                                삭제
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {comment.createdAt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                  첫 댓글을 남겨보세요!
                </div>
              )}
            </div>

            {/* Comment input */}
            <div className="flex gap-3">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="댓글을 입력하세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPostDetail;
