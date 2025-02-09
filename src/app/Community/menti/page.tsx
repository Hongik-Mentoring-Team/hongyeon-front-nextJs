import { Circle, CircleUserRound } from "lucide-react";

const CommunityTextTag = ({ TagName }) => {
  return (
    <div id="TagContainer" className="flex w-auto h-[40px] mr-4">
      <label className="flex w-auto h-9 px-2 items-center border rounded-xl bg-white">
        {TagName}
      </label>
    </div>
  );
};

const CommunityTextBox = ({ Title, MainText, memberID, Date }) => {
  return (
    <div
      id="TextBox"
      className="flex flex-col justify-between min-w-[750px] h-[150px] border-2 rounded-lg bg-gray p-4"
    >
      <h2
        id="TextBox_Title"
        className="w-auto h-auto justify-start items-center text-gray-800 text-2xl font-bold"
      >
        {Title}
      </h2>
      <span id="TextBox_MainText" className="w-auto h-auto">
        {MainText}
      </span>
      <div id="TextBox_MemInfo" className="flex w-full h-auto justify-between">
        <div
          id="TextBox_MemInfoBox"
          className="flex w-[200px] hyphens-auto justify-between items-center"
        >
          <CircleUserRound id="MemInfoBox_MemPicture" size={24} />
          <span id="MemInfoBox_Sector">백엔드</span>
          <span id="MemInfoBox_MemName">전형진</span>
          <span id="MemInfoBox_Date">02.07</span>
        </div>
        <div></div>
      </div>
    </div>
  );
};

const CommunityRightBlockBox = ({ memberID, Title }) => {
  return (
    <div className="flex flex-col w-[280px] h-auto mt-4 gap-2">
      <div className="flex justify-start items-center w-full h-auto gap-2">
        <CircleUserRound size={16} />

        <h2 className="flex justify-start items-center text-sm text-gray-900">
          {memberID}
        </h2>
      </div>
      <span className="text-lg text-gray-700 font-semibold">{Title}</span>
    </div>
  );
};

export default function Community() {
  return (
    <div className="flex w-full h-auto justify-between px-24">
      <div id="CommunityLeftContainer" className="flex">
        <div
          id="CommunityContainer"
          className="flex flex-col w-full h-auto gap-12"
        >
          {/* 게시판 제목 */}
          <div
            id="CommunityTitle"
            className="flex flex-col w-full h-auto my-5 gap-4"
          >
            <h1 className="text-4xl font-bold">멘티 게시판</h1>
            <h3 className="text-2xl font-semibold">
              원하는 멘토에게 질문하세요.
            </h3>
          </div>

          {/* 게시글 */}
          <div
            id="CommunityMenuBlock"
            className="flex flex-col w-full h-auto my-4"
          >
            <h2 id="CommunityMenuTitle" className="text-2xl font-semibold">
              {" "}
              게시글{" "}
            </h2>
            <div id="CommunityMenuTag" className="flex w-full h-auto py-2">
              <CommunityTextTag TagName={"프론트엔드"} />
              <CommunityTextTag TagName={"백엔드"} />
              <CommunityTextTag TagName={"AI/ML"} />
              <CommunityTextTag TagName={"클라우드"} />
              <CommunityTextTag TagName={"임베디드"} />
            </div>
          </div>

          {/* 글 블록 */}
          <div
            id="CommunityTextBoxContainer"
            className="flex flex-col w-full h-auto gap-2"
          >
            <CommunityTextBox
              Title="집에 가고 싶습니다."
              MainText="집은 언제 가는게 좋을까요?"
              memberID=""
              Date=""
            />
            <CommunityTextBox
              Title="집에 가고 싶습니다."
              MainText="집은 언제 가는게 좋을까요?"
              memberID=""
              Date=""
            />
            <CommunityTextBox
              Title="집에 가고 싶습니다."
              MainText="집은 언제 가는게 좋을까요?"
              memberID=""
              Date=""
            />
            <CommunityTextBox
              Title="집에 가고 싶습니다."
              MainText="집은 언제 가는게 좋을까요?"
              memberID=""
              Date=""
            />
            <CommunityTextBox
              Title="집에 가고 싶습니다."
              MainText="집은 언제 가는게 좋을까요?"
              memberID=""
              Date=""
            />
            <CommunityTextBox
              Title="집에 가고 싶습니다."
              MainText="집은 언제 가는게 좋을까요?"
              memberID=""
              Date=""
            />
          </div>
        </div>
      </div>

      <div
        id="CommunityRightContainer"
        className="sticky flex max-w-[360px] h-auto mt-[20px]"
      >
        {/* 게시판 왼쪽 바 */}
        <div
          id="LeftSticky"
          className="flex flex-col w-[320px] h-auto p-[20px] gap-4"
        >
          {/* 최신글 */}
          <div className="flex flex-col justify-center w-[300px] h-[280px] px-[20px] py-[16px] border-2 rounded-r-xl gap-6">
            {/* 최신글 제목 */}
            <div>
              <h2 className="flex justify-start items-center text-2xl font-bold">
                최신 멘토글을 만나보세요 😊
              </h2>
            </div>

            <div>
              <CommunityRightBlockBox
                memberID={"안산촌놈"}
                Title={"백엔드 스터디 모집합니다."}
              />
              <CommunityRightBlockBox
                memberID={"집가고싶다"}
                Title={"프론트엔드 재밌어요."}
              />
              <CommunityRightBlockBox
                memberID={"삿포로맥주공장"}
                Title={"AI는 언제할까요."}
              />
            </div>
          </div>

          {/* 조회수 많은 글 */}
          <div className="flex flex-col justify-center w-[300px] h-[280px] px-[20px] py-[16px] border-2 rounded-r-xl gap-6">
            <div>
              <h2 className="flex justify-start items-center text-2xl font-bold">
                조회수 HOT 게시글 🔥
              </h2>
            </div>

            <div>
              <CommunityRightBlockBox
                memberID={"부산돼지국밥밥"}
                Title={"[프로젝트] 프론트엔드 개발자 모집!"}
              />
              <CommunityRightBlockBox
                memberID={"한라봉대감귤"}
                Title={"AI 부트캠프 후기"}
              />
              <CommunityRightBlockBox
                memberID={"앞베란다창문"}
                Title={"컴공 4학년 취준 팁"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
