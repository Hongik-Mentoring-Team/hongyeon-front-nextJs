import { useRouter } from "next/navigation";
import { CircleUserRound, Search } from "lucide-react";
import MenteePostCard from "@/app/(Components)/ui/post/MenteePostCard";
import { MenteePostCardProps } from "@/app/(Components)/ui/post/MenteePostCardProps";
import Button from "@/app/(Components)/ui/Button";
import TagButton from "@/app/(Components)/ui/TagButton";

interface Tag {
  id: number;
  name: string;
}

// interface Post {
//   postId: number;
//   title: string;
//   content: string;
//   author: string;
//   createdAt: string;
// }

interface MenteeLayoutProps {
  tags: Tag[];
  posts: MenteePostCardProps[];
  selectedTags: number[];
  handleTagSelection: (tagId: number) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const MenteeLayout: React.FC<MenteeLayoutProps> = ({
  tags,
  posts,
  selectedTags,
  handleTagSelection,
  searchTerm,
  setSearchTerm,
}) => {
  const router = useRouter(); // ✅ Next.js 라우터 사용

  return (
    <div className="flex w-full h-auto">
      <div
        id="MenteeContainer"
        className="flex flex-col w-full h-auto px-32 gap-12"
      >
        {/* 게시판 제목 */}
        <div
          id="MenteeTitle"
          className="flex flex-col w-full h-auto my-5 gap-4"
        >
          <h1 className="text-4xl font-bold">멘티 게시판</h1>
          <h3 className="text-2xl font-semibold">
            원하는 멘토에게 질문하세요.
          </h3>
        </div>

        {/* 태그 필터 */}
        <div
          id="MenteeMenuBlock"
          className="flex flex-col w-full h-auto my-4 gap-1"
        >
          <h2 id="MenteeMenuTitle" className="text-2xl font-semibold">
            태그 선택
          </h2>
          <div id="MenteeMenuTag" className="flex w-full h-auto py-2 gap-1">
            {tags.map((tag) => (
              <TagButton
                key={tag.id}
                selected={selectedTags.includes(tag.id)}
                onClick={() => handleTagSelection(tag.id)}
              >
                {tag.name}
              </TagButton>
              // <MenteeTextTag
              //   key={tag.id}
              //   tag={tag}
              //   active={selectedTags.includes(tag.id)}
              //   onClick={() => handleTagSelection(tag.id)}
              // />
            ))}
          </div>
        </div>

        {/* 검색창 & 작성하기 버튼 */}
        <div className="flex w-full items-center justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* ✅ 작성하기 버튼 (검색창과 같은 높이, 오른쪽 정렬) */}
          <Button
            variant="primary"
            onClick={() => router.push("/Community/mentee/writePost")}
          >
            작성하기
          </Button>
        </div>

        {/* 게시글 목록 */}
        <div
          id="MenteeTextBoxContainer"
          className="flex flex-col w-full h-auto gap-2"
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <MenteePostCard
                key={post.postId}
                postId={post.postId}
                title={post.title}
                content={post.content}
                memberId={post.memberId}
                createdAt={post.createdAt}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">게시글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ 태그 버튼 컴포넌트
const MenteeTextTag: React.FC<{
  tag: Tag;
  active: boolean;
  onClick: () => void;
}> = ({ tag, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`}
  >
    {tag.name}
  </button>
);

// // ✅ 게시글 블록 컴포넌트
// const MenteeTextBox: React.FC<{
//   postId: number;
//   title: string;
//   mainText: string;
//   memberID: string;
//   date: string;
// }> = ({ postId, title, mainText, memberID, date }) => {
//   const router = useRouter();

//   return (
//     <div
//       onClick={() => router.push(`/Community/mentee/${postId}`)} // ✅ 클릭 시 이동
//       className="flex flex-col justify-between min-w-[750px] h-[150px] border-2 rounded-lg bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
//     >
//       <h2 className="w-auto text-gray-800 text-2xl font-bold">{title}</h2>
//       <p className="w-[300px] text-gray-700 line-clamp-1">{mainText}</p>
//       <div className="flex w-full justify-between items-center text-gray-500 text-sm">
//         <div className="flex items-center gap-2">
//           <CircleUserRound size={20} />
//           <span>{memberID}</span>
//         </div>
//         <span>{date}</span>
//       </div>
//     </div>
//   );
// };

export default MenteeLayout;
