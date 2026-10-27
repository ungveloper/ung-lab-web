import Link from "next/link";
import { AppContentContainer } from "@/components/app-content-container";
import styles from "./not-found.module.css";

export const metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청한 주소를 찾을 수 없어 홈과 주요 화면으로 이동할 수 있도록 안내합니다.",
};

const quickLinks = [
  { href: "/tools", label: "전체 도구 보기", description: "PDF, 이미지, 문서 도구를 한 번에 둘러봅니다." },
  { href: "/guides", label: "사용 가이드 보기", description: "각 도구의 사용법과 문제 해결 방법을 확인합니다." },
  { href: "/contact", label: "문의 페이지", description: "잘못된 링크나 오류가 계속되면 제보해 주세요." },
];

export default function NotFound() {
  return (
    <AppContentContainer as="main" className={styles.page}>
      <section className={styles.shell} aria-labelledby="not-found-title">
        <p className={styles.badge}>404 ERROR</p>
        <h1 id="not-found-title" className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p className={styles.description}>
          입력한 주소가 잘못되었거나 페이지 위치가 바뀌었을 수 있습니다.
          아래 바로가기에서 원하는 화면으로 이동해 보세요.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={`${styles.button} ${styles.primary}`}>홈으로 돌아가기</Link>
          <Link href="/tools" className={`${styles.button} ${styles.secondary}`}>전체 도구 보기</Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>이 화면에서 바로 이동할 수 있어요</h2>
          <ul className={styles.linkList}>
            {quickLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className={styles.linkCard}>
                  <strong>{link.label}</strong>
                  <span>{link.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppContentContainer>
  );
}
