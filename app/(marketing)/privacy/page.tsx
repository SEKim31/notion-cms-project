import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "개인정보 수집 및 이용에 관한 안내입니다.",
}

// 개인정보처리방침 페이지
export default function PrivacyPage() {
  return (
    <div className="container py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">개인정보처리방침</h1>
        <p className="mt-4 text-muted-foreground">
          최종 수정일: 2024년 1월 1일
        </p>

        <div className="mt-12 space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. 개인정보의 수집 및 이용 목적
            </h2>
            <p className="mt-4">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
              개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용
              목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를
              이행할 예정입니다.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 운영</li>
              <li>고객 문의 응대</li>
              <li>마케팅 및 광고 활용 (선택적 동의 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. 수집하는 개인정보 항목
            </h2>
            <p className="mt-4">
              회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>필수 항목: 이메일 주소, 비밀번호, 이름</li>
              <li>선택 항목: 프로필 사진, 연락처</li>
              <li>자동 수집 항목: 접속 IP, 쿠키, 서비스 이용 기록</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p className="mt-4">
              회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터
              개인정보를 수집 시에 동의 받은 개인정보 보유·이용 기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>회원 정보: 회원 탈퇴 시까지</li>
              <li>계약 또는 청약 철회에 관한 기록: 5년</li>
              <li>대금 결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="mt-4">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. 개인정보 보호책임자
            </h2>
            <p className="mt-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-4 rounded-lg border p-4">
              <p className="font-medium text-foreground">개인정보 보호책임자</p>
              <p className="mt-2">이메일: privacy@example.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. 개인정보처리방침의 변경
            </h2>
            <p className="mt-4">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행
              7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
