import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Grid2X2, House, MessageCircle } from "lucide-react";
import { AppContentContainer } from "@/components/app-content-container";

const destinations = [
  { href: "/tools", title: "전체 도구", description: "PDF·이미지·문서 작업에 필요한 기능을 찾아보세요.", icon: Grid2X2 },
  { href: "/guides", title: "사용 가이드", description: "도구 사용법과 자주 겪는 문제의 해결 방법을 확인하세요.", icon: BookOpen },
  { href: "/contact", title: "문의 및 오류 신고", description: "잘못된 링크나 오류를 발견했다면 알려주세요.", icon: MessageCircle },
];

/** Root 404 and workspace 404 render the same content, but the shell is applied only once. */
export function NotFoundContent() {
  return (
    <AppContentContainer as="main" className="ungnf">
      <section className="ungnf__container" aria-labelledby="ungnf-title">
        <div className="ungnf__hero">
          <span className="ungnf__symbol" aria-hidden="true"><Compass size={31} strokeWidth={1.8} /></span>
          <p className="ungnf__eyebrow">404 · PAGE NOT FOUND</p>
          <h1 id="ungnf-title" className="ungnf__title">페이지를 찾을 수 없습니다</h1>
          <p className="ungnf__description">
            주소가 잘못 입력됐거나 페이지가 이동했을 수 있습니다.
            필요한 기능을 찾을 수 있도록 바로가기를 준비했어요.
          </p>
          <div className="ungnf__actions">
            <Link href="/" className="ungnf__button ungnf__button--primary">
              <House size={19} aria-hidden="true" /> 홈으로 돌아가기
            </Link>
            <Link href="/tools" className="ungnf__button ungnf__button--secondary">
              전체 도구 살펴보기 <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="ungnf__section">
          <h2 className="ungnf__section-title">이런 페이지는 어떠세요?</h2>
          <p className="ungnf__section-desc">자주 찾는 메뉴로 바로 이동할 수 있습니다.</p>
          <ul className="ungnf__list">
            {destinations.map(({ href, title, description, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="ungnf__link">
                  <span className="ungnf__link-icon" aria-hidden="true"><Icon size={21} /></span>
                  <span className="ungnf__link-copy">
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </span>
                  <ArrowRight size={19} className="ungnf__link-arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppContentContainer>
  );
}
