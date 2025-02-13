"use client";
import { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import fetchProfile from "@/lib/server/fetchProfile"; // ✅ 프로필 데이터를 가져오는 함수

interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string; // MENTOR | MENTEE 구분
}

interface Review {
  id: number;
  reviewerName: string;
  content: string;
  createdAt: string;
  rating: number;
  writerId: number;
  targetId: number;
}

interface Badge {
  badgeId: number;
  badgeName: string;
  badgeImageUrl: string;
}

interface ProfileData {
  name: string;
  mainBadgeUrl: string | null; // 대표 뱃지
  imageUrl: string | null; // 프로필 사진 (Member 엔티티에 추가 필요)
  posts: Post[];
  badges: Badge[]; // 뱃지 내역
  followings: number[]; // 팔로잉 (유저 ID 리스트)
  followers: number[]; // 팔로워 (유저 ID 리스트)
  writtedReviews: Review[]; // 작성한 리뷰
  receivedReviews: Review[]; // 받은 리뷰
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfile();
      setProfile(data);
    };

    loadProfile();
  }, []);

  // ✅ 멘토 게시판과 멘티 게시판 글 필터링
  const mentorPosts =
    profile?.posts?.filter((post) => post.category === "MENTOR") || [];
  const menteePosts =
    profile?.posts?.filter((post) => post.category === "MENTEE") || [];

  return (
    <div className="flex flex-col w-full h-auto px-24">
      {/* 상단 프로필 정보 */}
      <div className="flex w-full h-auto justify-between items-end gap-6">
        {/* 프로필 사진 */}
        <div className="flex w-1/2 h-auto justify-center">
          {profile?.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt="프로필 사진"
              className="w-[250px] h-[250px] rounded-full object-cover border-2"
            />
          ) : (
            <CircleUserRound size={250} className="text-gray-400" />
          )}
        </div>

        {/* 대표 뱃지 */}
        <div className="flex w-1/2 h-auto items-center justify-center">
          {profile?.mainBadgeUrl ? (
            <img
              src={profile.mainBadgeUrl}
              alt="대표 뱃지"
              className="w-[100px] h-[100px] object-cover border-2"
            />
          ) : (
            <p className="text-gray-500">대표 뱃지가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 뱃지 내역 */}
      <div className="flex flex-col w-full mt-6">
        <h2 className="text-xl font-bold mb-2">뱃지 내역</h2>
        <div className="flex gap-2">
          {profile?.badges?.length ? (
            profile.badges.map((badge, index) => (
              <div
                key={index}
                className="p-2 bg-yellow-300 rounded-lg text-sm font-medium"
              >
                {badge.badgeName}
              </div>
            ))
          ) : (
            <p className="text-gray-500">획득한 뱃지가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 팔로워 / 팔로잉 */}
      <div className="flex w-full justify-between mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold">팔로워</h3>
          <p className="text-xl font-bold">{profile?.followers.length ?? 0}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">팔로잉</h3>
          <p className="text-xl font-bold">{profile?.followings.length ?? 0}</p>
        </div>
      </div>

      {/* 참여한 게시판 내역 */}
      <div className="flex w-full h-auto p-4 gap-5 mt-6">
        {/* 멘토 게시판 */}
        <div className="flex flex-col w-1/2 h-full p-4 bg-blue-50">
          <h2 className="text-lg font-bold mb-3">멘토로 활동한 내역</h2>
          {mentorPosts.length > 0 ? (
            mentorPosts.map((post) => (
              <div
                key={post.postId}
                className="p-3 bg-white rounded-lg shadow mb-2"
              >
                <h3 className="text-md font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.content}</p>
                <span className="text-xs text-gray-400">{post.createdAt}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">멘토 게시글이 없습니다.</p>
          )}
        </div>

        {/* 멘티 게시판 */}
        <div className="flex flex-col w-1/2 h-full p-4 bg-blue-50">
          <h2 className="text-lg font-bold mb-3">멘티로 활동한 내역</h2>
          {menteePosts.length > 0 ? (
            menteePosts.map((post) => (
              <div
                key={post.postId}
                className="p-3 bg-white rounded-lg shadow mb-2"
              >
                <h3 className="text-md font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.content}</p>
                <span className="text-xs text-gray-400">{post.createdAt}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">멘티 게시글이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 작성한 리뷰 / 전달받은 리뷰 */}
      <div className="flex w-full mt-6 gap-6">
        <div className="flex flex-col w-1/2 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-bold mb-3">작성한 리뷰</h2>
          {profile?.writtedReviews.length ? (
            profile.writtedReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 bg-white rounded-lg shadow mb-2"
              >
                <h3 className="text-md font-semibold">
                  {review.writerId + "님이 작성한 리뷰"}
                </h3>
                <p className="text-sm text-gray-600">{review.content}</p>
                <span className="text-xs text-gray-400">
                  {review.createdAt}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
          )}
        </div>

        <div className="flex flex-col w-1/2 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-bold mb-3">전달받은 리뷰</h2>
          {profile?.receivedReviews.length ? (
            profile.receivedReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 bg-white rounded-lg shadow mb-2"
              >
                <h3 className="text-md font-semibold">
                  {review.writerId + "님이 작성한 리뷰"}
                </h3>
                <p className="text-sm text-gray-600">{review.content}</p>
                <span className="text-xs text-gray-400">
                  {review.createdAt}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">받은 리뷰가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
