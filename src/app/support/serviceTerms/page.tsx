import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">이용약관</h1>
      <p className="mb-4">
        본 이용약관은 본 서비스를 이용하는 사용자의 권리 및 의무를 규정하며,
        이용자는 본 약관을 준수해야 합니다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. 서비스 제공</h2>
      <p>회사는 다음 서비스를 제공합니다.</p>
      <ul className="list-disc list-inside ml-4">
        <li>회원가입 및 계정 관리 서비스</li>
        <li>게시판 및 커뮤니티 기능</li>
        <li>맞춤형 정보 제공 서비스</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. 광고</h2>
      <p>
        본 서비스는 광고를 포함할 수도 있으며, 사용자는 광고 노출 및 관련된
        마케팅 정보를 수신할 수 있습니다. 사용자는 설정을 통해 일부 광고 수신을
        거부할 수 있습니다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. 금지 행위</h2>
      <p>이용자는 다음과 같은 행위를 해서는 안 됩니다.</p>
      <ul className="list-disc list-inside ml-4">
        <li>타인의 계정을 도용하거나 부정 사용</li>
        <li>악성 코드 배포, 해킹 등의 부정 행위</li>
        <li>불법적인 목적 또는 공공질서에 반하는 행위</li>
        <li>과도한 광고, 스팸성 콘텐츠 작성 및 배포</li>
        <li>회사 또는 타인의 권리를 침해하는 행위</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. 게시물 및 저작권</h2>
      <p>
        이용자가 서비스 내에 게시한 게시물의 저작권은 이용자에게 귀속됩니다. 단,
        회사는 저작권법을 준수하며 서비스 운영을 위해 필요한 범위 내에서 해당
        게시물을 복제, 전시, 배포 등의 방식으로 사용할 수도 있습니다. 게시물이
        불법적이거나 서비스 운영 방침에 위배될 경우, 회사는 해당 게시물을 삭제할
        수 있습니다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        5. 서비스 중단 및 해지
      </h2>
      <p>다음과 같은 경우 서비스 이용이 제한될 수 있습니다.</p>
      <ul className="list-disc list-inside ml-4">
        <li>회원이 금지 행위를 반복하는 경우</li>
        <li>법적 요구사항에 의해 서비스 운영이 불가능한 경우</li>
        <li>운영 및 기술적 문제로 인해 서비스 제공이 어려운 경우</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. 문의 사항</h2>
      <p>본 약관에 대한 문의 사항은 아래 이메일로 연락 바랍니다.</p>
      <p className="mt-2">
        <strong>이메일:</strong> [이메일 주소]
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

export default TermsOfService;
