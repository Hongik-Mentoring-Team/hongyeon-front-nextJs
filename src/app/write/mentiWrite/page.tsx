const WriteBlock = ({ label, type, placeholder }) => {
  return (
    <div className="flex flex-col w-full gap-3">
      <label className="text-2xl font-semibold text-gray-900">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-2 border rounded-r-md border-gray-300"
      ></input>
    </div>
  );
};

export default function mentorWrite() {
  return (
    // 부모가 h-auto로 시작하기에 h-full을 사용한다. (h-full : 부모 컴포넌트 크기의 100%로 맞추기)
    <div className="flex w-screen h-auto p-4 justify-center bg-gray-100">
      {/* 멘토 글쓰기 페이지 */}
      <div className="flex flex-col w-[600px] h-full p-4 justify-center gap-10 border rounded-r-md border-gray-300 bg-white">
        {/* '글쓰기' */}
        <h2 className="text-6xl font-bold text-gray-900">멘티 글쓰기</h2>

        {/* '제목' */}
        <WriteBlock
          label="제목"
          type="title"
          placeholder={"제목을 입력하세요."}
        />

        {/* '게시물 태그' */}
        <WriteBlock
          label="게시물 태그"
          type="tag"
          placeholder={"게시물 태그를 입력하세요."}
        />

        {/* '본문' */}
        <div className="flex flex-col w-full gap-2">
          <label className="text-2xl font-semibold text-gray-900">본문</label>
          <textarea className="w-full h-[400px] border rounded-r-md border-gray-300"></textarea>
        </div>

        {/* '글쓰기' */}
        <div className="grid grid-cols-2"></div>
      </div>
    </div>
  );
}
