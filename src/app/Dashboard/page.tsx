export default function Home() {
  return (
    // Main Page
    // 부모가 h-auto로 시작하기에 h-full을 사용한다. (h-full : 부모 컴포넌트 크기의 100%로 맞추기)
    <div className="flex flex-col w-full h-full gap-5">
      {/* 설명 페이지 padding-32px 지키기! */}
      <div className="flex w-full h-72 px-32 justify-center items-center shadow-sm bg-gray-50">
        <span className="text-6xl text-blue-400">설명 페이지</span>
      </div>

      {/* 멘토 멘티 게시판 */}
      <div className="flex w-full h-auto px-24 justify-between items-center">
        <div className="flex w-full h-auto justify-cetner items-center">
          <div className="flex w-1/2 h-48 justify-center items-center bg-blue-200">
            <span className="text-5xl text-blue-400">멘토로 시작하기</span>
          </div>
          <div className="flex w-1/2 h-48 justify-center items-center bg-blue-200">
            <span className="text-5xl text-blue-400">멘티로 시작하기</span>
          </div>
        </div>
      </div>

      <section>
        <div className="w-full h-auto px-24 mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-2">1</h2>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-2">2</h2>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-2">3</h2>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">캠퍼스 커넥트</h3>
              <p className="text-gray-400">
                선배와 후배를 잇는 대학생 멘토링 플랫폼
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">문의하기</h3>
              <p className="text-gray-400">이메일: contact@campusconnect.kr</p>
              <p className="text-gray-400">전화: 02-123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">바로가기</h3>
              <div className="space-y-2 text-gray-400">
                <p>서비스 소개</p>
                <p>이용약관</p>
                <p>개인정보처리방침</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
