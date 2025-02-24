import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">개인정보 처리방침</h1>
      <p className="mb-4">
        본 개인정보 처리방침은 사용자의 개인정보 보호와 관련하여 서비스에서
        수집하는 정보, 활용 방법, 보호 조치 등을 설명합니다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        1. 수집하는 개인정보 항목
      </h2>
      <p>서비스는 다음과 같은 개인정보를 수집할 수 있습니다.</p>
      <ul className="list-disc list-inside ml-4">
        <li>
          <strong>필수 정보:</strong> 이메일 주소, 사용자 이름
        </li>
        <li>
          <strong>선택 정보:</strong> 프로필 사진
        </li>
        <li>
          <strong>자동 수집 정보:</strong> 접속 기록, 쿠키, 기기 정보
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        2. 개인정보의 수집 및 이용 목적
      </h2>
      <p>수집된 개인정보는 다음과 같은 목적으로 사용됩니다.</p>
      <ul className="list-disc list-inside ml-4">
        <li>회원 가입 및 서비스 이용</li>
        <li>맞춤형 서비스 제공</li>
        <li>법적 의무 준수 및 보안 강화</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        3. 개인정보의 보관 및 파기
      </h2>
      <p>
        사용자의 개인정보는 서비스 이용 기간 동안 보관되며, 회원 탈퇴 시 즉시
        삭제됩니다. 법령에 따라 일정 기간 보관이 필요한 경우, 해당 법률을
        준수하여 데이터를 보관합니다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        4. 개인정보의 제3자 제공
      </h2>
      <p>
        사용자의 동의 없이 제3자에게 개인정보를 제공하지 않습니다. 단, 법적
        요구가 있는 경우 제공될 수 있습니다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. 쿠키 사용 안내</h2>
      <p>
        본 서비스는 사용자 인증 및 보안 강화를 위해 쿠키를 사용할 수 있습니다.
        사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
      </p>

      <h3 className="text-xl font-semibold mt-4 mb-2">1) 쿠키의 사용 목적</h3>
      <ul className="list-disc list-inside ml-4">
        <li>사용자 로그인 세션 유지</li>
        <li>서비스 보안 강화를 위한 인증</li>
        <li>서비스 개선을 위한 방문 기록 분석</li>
      </ul>

      <h3 className="text-xl font-semibold mt-4 mb-2">
        2) 쿠키의 관리 및 거부 방법
      </h3>
      <p>
        사용자는 브라우저 설정을 통해 쿠키를 허용하거나 거부할 수 있습니다.
        쿠키를 비활성화하면 일부 기능이 제한될 수 있습니다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        6. 개인정보 보호 책임자
      </h2>
      <p>문의사항이 있으시면 아래의 연락처로 문의해 주세요.</p>
      <p className="mt-2">
        <strong>책임자:</strong> [홍익 멘토링 개발 팀]
      </p>
      <p>
        <strong>이메일:</strong> [rmsghchl0@gmail.com]
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. 정책 변경 및 공지</h2>
      <p>
        본 개인정보 처리방침은 변경될 수 있으며, 변경 시 공지를 통해
        안내드립니다.
      </p>

      <footer className="mt-6 text-gray-500 text-sm">
        <p>
          <strong>최초 시행일:</strong> 2025-02-24
        </p>
        <p>
          <strong>최종 수정일:</strong> 2025-02-24
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
