import { CircleUserRound } from "lucide-react";

export default function Profile() {
  return (
    <div className="flex flex-col w-full h-auto px-24">
      <div className="flex w-full h-auto justify-between items-end gap-6">
        {/* 프로필 사진 */}
        <div className="flex w-1/2 h-auto justify-center">
          <CircleUserRound size={250} />
        </div>

        {/* 배지 내역 */}
        <div className="flex w-1/2 h-auto">
          <div
            id="배지 내역"
            className="flex w-full min-h-[200px] mb-[15px] bg-blue-100"
          >
            <div id="배지 대시보드" className="grid grid-cols-10"></div>
          </div>
        </div>
      </div>

      {/* 참여한 게시판 내역역 */}
      <div className="flex w-full h-screen p-4 gap-5">
        <div className="flex w-1/2 h-full p-4 bg-blue-50">멘토 게시판</div>
        <div className="flex w-1/2 h-full p-4 bg-blue-50">멘티 게시판</div>
      </div>
    </div>
  );
}
