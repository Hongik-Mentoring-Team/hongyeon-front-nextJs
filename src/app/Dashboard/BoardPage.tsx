export default function BoardPage() {
  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* 설명 페이지 padding-32px 지키기! */}
      <div className="flex w-full h-72 px-32 justify-center items-center shadow-sm bg-gray-50">
        <span className="text-6xl text-blue-400">설명 페이지</span>
      </div>

      {/* 멘토 멘티 게시판 글들을 보여주는 섹션 (예상 5개) */}
      <div className="flex w-full h-auto px-24 gap-5">
        <div className="flex w-1/2 h-full p-4 bg-blue-50">멘토 게시판</div>
        <div className="flex w-1/2 h-full p-4 bg-blue-50">멘티 게시판</div>
      </div>
    </div>
  );
}
