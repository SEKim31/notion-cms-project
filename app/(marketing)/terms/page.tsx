import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "이용약관",
  description: "서비스 이용에 관한 약관입니다.",
}

// 이용약관 페이지
export default function TermsPage() {
  return (
    <div className="container py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">이용약관</h1>
        <p className="mt-4 text-muted-foreground">
          최종 수정일: 2024년 1월 1일
        </p>

        <div className="mt-12 space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제1조 (목적)
            </h2>
            <p className="mt-4">
              이 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회사와
              이용자의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제2조 (용어의 정의)
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>&quot;서비스&quot;</strong>란 회사가 제공하는 모든 온라인 서비스를
                의미합니다.
              </li>
              <li>
                <strong>&quot;이용자&quot;</strong>란 본 약관에 동의하고 회사가 제공하는
                서비스를 이용하는 자를 의미합니다.
              </li>
              <li>
                <strong>&quot;회원&quot;</strong>이란 회사에 개인정보를 제공하여 회원등록을
                한 자로서, 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제3조 (약관의 효력 및 변경)
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
              <li>
                회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을
                변경할 수 있습니다.
              </li>
              <li>
                변경된 약관은 서비스 내 공지사항을 통해 공지하며, 공지 후 7일이
                경과한 시점부터 효력이 발생합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제4조 (서비스의 제공)
            </h2>
            <p className="mt-4">회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>웹 애플리케이션 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제5조 (회원가입)
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                이용자는 회사가 정한 절차에 따라 회원가입을 신청하고, 회사가
                이를 승인함으로써 회원가입이 완료됩니다.
              </li>
              <li>
                회사는 다음 각 호에 해당하는 신청에 대해서는 승인을 거부할 수
                있습니다.
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재한 경우</li>
                  <li>기타 회원으로 등록하는 것이 부적절하다고 판단되는 경우</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제6조 (회원의 의무)
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>회원은 본 약관 및 관계 법령을 준수해야 합니다.</li>
              <li>
                회원은 자신의 계정 정보를 관리할 책임이 있으며, 이를 제3자에게
                양도하거나 대여할 수 없습니다.
              </li>
              <li>
                회원은 서비스를 이용하여 불법적인 행위를 해서는 안 됩니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제7조 (서비스 이용의 제한)
            </h2>
            <p className="mt-4">
              회사는 회원이 다음 각 호에 해당하는 행위를 한 경우 서비스 이용을
              제한하거나 회원자격을 박탈할 수 있습니다.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>타인의 정보를 도용한 경우</li>
              <li>서비스 운영을 방해한 경우</li>
              <li>관련 법령 또는 약관을 위반한 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제8조 (면책조항)
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등
                불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이
                면제됩니다.
              </li>
              <li>
                회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을
                지지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              제9조 (분쟁 해결)
            </h2>
            <p className="mt-4">
              본 약관과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 성실히
              협의하여 해결하도록 합니다. 협의가 이루어지지 않을 경우 관할
              법원에 소송을 제기할 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
