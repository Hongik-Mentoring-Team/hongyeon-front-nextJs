import { useRouter } from "next/navigation";
import { CircleUserRound, Search, PenLine } from "lucide-react";
import MenteePostCard from "@/app/(Components)/ui/post/MenteePostCard";
import { MenteePostCardProps } from "@/app/(Components)/ui/post/MenteePostCardProps";
import Button from "@/app/(Components)/ui/Button";
import TagButton from "@/app/(Components)/ui/TagButton";
import Input from "@/app/(Components)/ui/Input";

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
    <div className="flex w-full h-auto bg-white pt-[70px]">
      <div
        id="MenteeContainer"
        className="flex flex-col w-full h-auto px-32 gap-8 bg-white"
      >
        {/* 게시판 제목 */}
        <div
          id="MenteeTitle"
          className="flex flex-col w-full h-auto my-5 gap-4 border border-gray-300 rounded-lg p-5 bg-white"
        >
          <h1 className="text-4xl font-bold">멘티 게시판</h1>
          <h3 className="text-2xl font-semibold">
            원하는 멘토에게 질문하세요.
          </h3>
        </div>

        {/* 태그, 검색, 작성하기 영역을 하나의 박스로 묶기 */}
        <div className="w-full border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
          {/* 태그 필터 */}
          <div
            id="MenteeMenuBlock"
            className="flex flex-col w-full h-auto gap-3 mb-5"
          >
            <h2 id="MenteeMenuTitle" className="text-2xl font-semibold">
              태그 선택
            </h2>
            <div
              id="MenteeMenuTag"
              className="flex flex-wrap w-full h-auto py-2 gap-2"
            >
              {tags.map((tag) => (
                <TagButton
                  key={tag.id}
                  selected={selectedTags.includes(tag.id)}
                  onClick={() => handleTagSelection(tag.id)}
                >
                  {tag.name}
                </TagButton>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-full h-px bg-gray-200 my-4"></div>

          {/* 검색창 & 작성하기 버튼 */}
          <div className="flex w-full items-center justify-between gap-4 pt-2">
            <div className="relative w-full sm:w-64">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-500 focus:border-primary focus:ring-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* ✅ 작성하기 버튼 (검색창과 같은 높이, 오른쪽 정렬) */}
            <Button
              variant="primary"
              icon={<PenLine size={16} />}
              onClick={() => router.push("/Community/mentee/writePost")}
            >
              작성하기
            </Button>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div
          id="MenteeTextBoxContainer"
          className="flex flex-col w-full h-auto gap-3 py-2"
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
                author={post.author}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-300">
              <p className="text-gray-500">게시글이 없습니다.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/Community/mentee/writePost")}
              >
                첫 게시글 작성하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
