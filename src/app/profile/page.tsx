"use client";
import { useEffect, useState } from "react";
import { CircleUserRound, Award, MessageSquare, Users } from "lucide-react";
import fetchProfile from "@/lib/server/fetchProfile"; // ✅ 프로필 데이터를 가져오는 함수
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    <div className="flex flex-col w-full h-auto px-24 py-8 bg-white pt-[70px]">
      {/* 상단 프로필 정보 */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mb-8">
        <div className="flex w-full h-auto justify-between items-center gap-6">
          {/* 프로필 사진 및 이름 */}
          <div className="flex flex-col items-center gap-4">
            {profile?.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt="프로필 사진"
                className="w-[200px] h-[200px] rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="flex items-center justify-center w-[200px] h-[200px] rounded-full bg-gray-100 border border-gray-300">
                <CircleUserRound size={120} className="text-gray-400" />
              </div>
            )}
            <h1 className="text-2xl font-bold">{profile?.name || "사용자"}</h1>
          </div>

          {/* 뱃지 내역 */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <Award className="mr-2 text-primary" size={20} />
                대표 뱃지
              </h2>
              {profile?.mainBadgeUrl ? (
                <img
                  src={profile.mainBadgeUrl}
                  alt="대표 뱃지"
                  className="w-[100px] h-[100px] object-cover border border-gray-300 rounded-md"
                />
              ) : (
                <div className="flex items-center justify-center w-[100px] h-[100px] bg-gray-100 border border-gray-300 rounded-md">
                  <p className="text-gray-500 text-sm text-center">
                    대표 뱃지 없음
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 max-w-[300px] justify-center">
              {profile?.badges?.length ? (
                profile.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-medium text-yellow-700"
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
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-center mb-2">
              <Users className="mr-2 text-primary" size={20} />
              <h3 className="text-lg font-semibold">팔로우 현황</h3>
            </div>
            <div className="flex gap-6">
              <div className="text-center border-r border-gray-200 pr-6">
                <h3 className="text-md font-medium text-gray-600">팔로워</h3>
                <p className="text-xl font-bold">
                  {profile?.followers.length ?? 0}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-md font-medium text-gray-600">팔로잉</h3>
                <p className="text-xl font-bold">
                  {profile?.followings.length ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 참여한 게시판 내역 */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
          활동 내역
        </h2>
        <div className="flex w-full h-auto gap-6">
          {/* 멘토 게시판 */}
          <div className="flex flex-col w-1/2 h-full border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center text-primary">
              <MessageSquare className="mr-2" size={18} />
              멘토로 활동한 내역
            </h2>
            <div className="h-px bg-gray-200 mb-3"></div>
            {mentorPosts.length > 0 ? (
              <div className="space-y-3">
                {mentorPosts.map((post) => (
                  <div
                    key={post.postId}
                    className="p-3 bg-white rounded-lg border border-gray-200 mb-2 cursor-pointer hover:border-primary transition-colors"
                    onClick={() =>
                      router.push(`/Community/mentor/${post.postId}`)
                    }
                  >
                    <h3 className="text-md font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {post.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">멘토 게시글이 없습니다.</p>
              </div>
            )}
          </div>

          {/* 멘티 게시판 */}
          <div className="flex flex-col w-1/2 h-full border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center text-primary">
              <MessageSquare className="mr-2" size={18} />
              멘티로 활동한 내역
            </h2>
            <div className="h-px bg-gray-200 mb-3"></div>
            {menteePosts.length > 0 ? (
              <div className="space-y-3">
                {menteePosts.map((post) => (
                  <div
                    key={post.postId}
                    className="p-3 bg-white rounded-lg border border-gray-200 mb-2 cursor-pointer hover:border-primary transition-colors"
                    onClick={() =>
                      router.push(`/Community/mentee/${post.postId}`)
                    }
                  >
                    <h3 className="text-md font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {post.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">멘티 게시글이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 작성한 리뷰 / 전달받은 리뷰 */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
          리뷰 내역
        </h2>
        <div className="flex w-full gap-6">
          <div className="flex flex-col w-1/2 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center text-primary">
              <MessageSquare className="mr-2" size={18} />
              작성한 리뷰
            </h2>
            <div className="h-px bg-gray-200 mb-3"></div>
            {profile?.writtedReviews?.length ? (
              <div className="space-y-3">
                {profile.writtedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-semibold">
                        {review.writerId + "님이 작성한 리뷰"}
                      </h3>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.content}</p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {review.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col w-1/2 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center text-primary">
              <MessageSquare className="mr-2" size={18} />
              전달받은 리뷰
            </h2>
            <div className="h-px bg-gray-200 mb-3"></div>
            {profile?.receivedReviews?.length ? (
              <div className="space-y-3">
                {profile.receivedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-semibold">
                        {review.writerId + "님이 작성한 리뷰"}
                      </h3>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.content}</p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {review.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">받은 리뷰가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
