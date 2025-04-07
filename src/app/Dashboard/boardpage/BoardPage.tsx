"use client";

import fetchMenteePosts from "@/lib/server/fetchMenteePosts";
import fetchMentorPosts from "@/lib/server/fetchMentorPosts";
import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string; // MENTOR | MENTEE 구분분
}

const Boardpage = () => {
  const router = useRouter();
  const [mentorPost, setmentorPosts] = useState<Post[]>([]);
  const [menteePost, setmenteePosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadMentorPosts = async () => {
      const data = await fetchMentorPosts();
      setmentorPosts(data);
    };

    const loadMenteePosts = async () => {
      const data = await fetchMenteePosts();
      setmenteePosts(data);
    };

    loadMentorPosts();
    loadMenteePosts();
  }, []);

  const mentorPosts =
    mentorPost?.filter((post) => post.category == "MENTOR") || [];
  const menteePosts =
    menteePost?.filter((post) => post.category == "MENTEE") || [];

  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* 설명 페이지 padding-32px 지키기! */}
      <div className="flex w-full h-72 px-8 md:px-32 justify-center items-center shadow-sm bg-gray-50">
        <span className="text-4xl md:text-6xl text-blue-400">설명 페이지</span>
      </div>

      <div className="flex w-full h-auto px-6 lg:px-24 mt-4 items-center">
        <h2 className="text-xl md:text-2xl text-gray-800 font-bold">
          게시판 글 모음 🔥
        </h2>
      </div>

      {/* 멘토 멘티 게시판 글들을 보여주는 섹션 (예상 5개) */}
      <div className="flex flex-col lg:flex-row w-full h-auto px-6 lg:px-24 gap-5">
        {/* 멘토 게시판 글 섹션 */}
        <div className="flex flex-col w-full lg:w-1/2 h-full p-4 bg-blue-50 gap-4">
          <h2 className="text-2xl text-gray-800">멘토 게시판</h2>
          <div
            id="MentorTextBoxContainer"
            className="flex flex-col w-full h-auto gap-2"
          >
            {mentorPosts.length > 0 ? (
              mentorPosts.map((post) => (
                <div
                  key={post.postId}
                  className="mb-2 p-3 rounded-lg shadow cursor-pointer bg-white hover:bg-gray-100"
                  onClick={() =>
                    router.push(`/Community/mentor/${post.postId}`)
                  } // ✅ 멘토 게시글 클릭 시 이동
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CircleUserRound size={20} />
                        <span>{post.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">멘토 게시글이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 멘티 게시판 글 섹션 */}
        <div className="flex flex-col w-full lg:w-1/2 h-full p-4 bg-blue-50 gap-4">
          <h2 className="text-2xl text-gray-800">멘티 게시판</h2>
          <div
            id="MenteeTextBoxContainer"
            className="flex flex-col w-full h-auto gap-2"
          >
            {menteePosts.length > 0 ? (
              menteePosts.map((post) => (
                <div
                  key={post.postId}
                  className="mb-2 p-3 rounded-lg shadow cursor-pointer bg-white hover:bg-gray-100"
                  onClick={() =>
                    router.push(`/Community/mentor/${post.postId}`)
                  } // ✅ 멘티 게시글 클릭 시 이동 (수정: mentor -> mentee)
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CircleUserRound size={20} />
                        <span>{post.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">멘티 게시글이 없습니다.</p>
            )}
          </div>
        </div>
        {/* 게시글 목록 */}
      </div>
    </div>
  );
};

export default Boardpage;
