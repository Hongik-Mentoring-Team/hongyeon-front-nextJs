"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
}

const MentorPostDetail = () => {
  const { postId } = useParams(); //경로변수 가져오기
  const [post, setPost] = useState<Post | null>(null);

  //api호출
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}`
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

  if (!post)
    return <p className="text-centor mt-10"> 게시글을 불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        작성자: {post.author} | {post.createdAt}
      </p>
      <div className="border-t pt-4">
        <p className="text-lg">{post.content}</p>
      </div>
    </div>
  );
};

export default MentorPostDetail;
