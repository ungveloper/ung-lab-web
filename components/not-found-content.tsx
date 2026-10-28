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
    <AppContentContainer as="main" className={`ungnf w-full [padding-block:clamp(30px,_5vw,_68px)_86px] min-h-[clamp(620px,_calc(100vh_-_190px),_980px)] [&_a:focus-visible]:[outline:3px_solid_#93b6ff] [&_a:focus-visible]:[outline-offset:3px] max-[640px]:[padding-block:22px_60px] max-[640px]:min-h-[580px] [@media_(prefers-reduced-motion:_reduce)]:[&_*]:![transition:none]`}>
      <section className={`ungnf__container box-border w-[min(100%,_790px)] [margin-inline:auto] text-[#23324a]`} aria-labelledby="ungnf-title">
        <div className={`ungnf__hero rounded-[26px] [border:1px_solid_#dce6f4] bg-[linear-gradient(158deg,_#fff_8%,_#f5f9ff_100%)] shadow-[0_20px_55px_rgba(27,_57,_115,_.075)] text-center [padding:clamp(32px,_5vw,_58px)_clamp(20px,_4vw,_45px)] max-[640px]:rounded-[20px] max-[640px]:[padding:30px_18px]`}>
          <span className={`ungnf__symbol inline-flex justify-center items-center w-[70px] h-[70px] bg-[#e6efff] text-[#2563eb] [border:1px_solid_#d1e0ff] rounded-[22px] mb-5`} aria-hidden="true"><Compass size={31} strokeWidth={1.8} /></span>
          <p className={`ungnf__eyebrow [margin:0_0_10px] text-xs font-extrabold tracking-[.13em] text-[#2862dc]`}>404 · PAGE NOT FOUND</p>
          <h1 id="ungnf-title" className={`ungnf__title [.ungnf_&]:m-0 [.ungnf_&]:text-[#16243e] [.ungnf_&]:font-extrabold [.ungnf_&]:text-[clamp(27px,_4vw,_41px)] [.ungnf_&]:tracking-[-.035em] [.ungnf_&]:leading-[1.3] [.ungnf_&]:break-keep`}>페이지를 찾을 수 없습니다</h1>
          <p className={`ungnf__description [.ungnf_&]:[margin:17px_auto_0] [.ungnf_&]:max-w-[530px] [.ungnf_&]:text-[clamp(15px,_2vw,_17px)] [.ungnf_&]:leading-[1.9] [.ungnf_&]:font-[450] [.ungnf_&]:text-[#66738c] [.ungnf_&]:break-keep [.ungnf_&]:[white-space:pre-line]`}>
            주소가 잘못 입력됐거나 페이지가 이동했을 수 있습니다.
            필요한 기능을 찾을 수 있도록 바로가기를 준비했어요.
          </p>
          <div className={`ungnf__actions flex items-center justify-center flex-wrap gap-3 mt-[26px] max-[640px]:flex-col max-[640px]:items-stretch`}>
            <Link href="/" className={`ungnf__button ungnf__button--primary [.ungnf_&]:inline-flex [.ungnf_&]:items-center [.ungnf_&]:justify-center [.ungnf_&]:gap-[10px] [.ungnf_&]:min-h-12 [.ungnf_&]:min-w-[175px] [.ungnf_&]:box-border [.ungnf_&]:[padding:12px_20px] [.ungnf_&]:[border:1px_solid_transparent] [.ungnf_&]:rounded-[13px] [.ungnf_&]:no-underline [.ungnf_&]:text-[15px] [.ungnf_&]:font-[750] [.ungnf_&]:leading-[1.4] [.ungnf_&]:[transition:background-color_.15s_ease,_border-color_.15s_ease,_box-shadow_.15s_ease,_transform_.15s_ease] [.ungnf_&]:bg-[#2563eb] [.ungnf_&]:border-[#2563eb] [.ungnf_&]:!text-[#fff] [.ungnf_&]:shadow-[0_10px_22px_rgba(37,_99,_235,_.18)] [.ungnf_&:visited]:bg-[#2563eb] [.ungnf_&:visited]:border-[#2563eb] [.ungnf_&:visited]:!text-[#fff] [.ungnf_&:visited]:shadow-[0_10px_22px_rgba(37,_99,_235,_.18)] [.ungnf_&:hover]:bg-[#1d4ed8] [.ungnf_&:hover]:border-[#1d4ed8] [.ungnf_&:hover]:[transform:translateY(-1px)] max-[640px]:[.ungnf_&]:w-full max-[640px]:[.ungnf_&]:min-w-0`}>
              <House size={19} aria-hidden="true" /> 홈으로 돌아가기
            </Link>
            <Link href="/tools" className={`ungnf__button ungnf__button--secondary [.ungnf_&]:inline-flex [.ungnf_&]:items-center [.ungnf_&]:justify-center [.ungnf_&]:gap-[10px] [.ungnf_&]:min-h-12 [.ungnf_&]:min-w-[175px] [.ungnf_&]:box-border [.ungnf_&]:[padding:12px_20px] [.ungnf_&]:[border:1px_solid_transparent] [.ungnf_&]:rounded-[13px] [.ungnf_&]:no-underline [.ungnf_&]:text-[15px] [.ungnf_&]:font-[750] [.ungnf_&]:leading-[1.4] [.ungnf_&]:[transition:background-color_.15s_ease,_border-color_.15s_ease,_box-shadow_.15s_ease,_transform_.15s_ease] [.ungnf_&]:bg-[#fff] [.ungnf_&]:border-[#cad8ef] [.ungnf_&]:!text-[#244b9a] [.ungnf_&:visited]:bg-[#fff] [.ungnf_&:visited]:border-[#cad8ef] [.ungnf_&:visited]:!text-[#244b9a] [.ungnf_&:hover]:bg-[#f5f9ff] [.ungnf_&:hover]:border-[#96b4e6] [.ungnf_&:hover]:[transform:translateY(-1px)] max-[640px]:[.ungnf_&]:w-full max-[640px]:[.ungnf_&]:min-w-0`}>
              전체 도구 살펴보기 <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={`ungnf__section mt-[34px]`}>
          <h2 className={`ungnf__section-title [.ungnf_&]:m-0 [.ungnf_&]:text-[#23324a] [.ungnf_&]:text-[19px] [.ungnf_&]:font-[750] [.ungnf_&]:leading-normal`}>이런 페이지는 어떠세요?</h2>
          <p className={`ungnf__section-desc [.ungnf_&]:[margin:7px_0_18px] [.ungnf_&]:text-[#697992] [.ungnf_&]:text-sm [.ungnf_&]:leading-[1.75]`}>자주 찾는 메뉴로 바로 이동할 수 있습니다.</p>
          <ul className={`ungnf__list [list-style:none] grid gap-3 p-0 m-0 [&_li]:m-0 [&_li]:p-0`}>
            {destinations.map(({ href, title, description, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className={`ungnf__link [.ungnf_&]:box-border [.ungnf_&]:flex [.ungnf_&]:items-center [.ungnf_&]:gap-4 [.ungnf_&]:[padding:19px_20px] [.ungnf_&]:rounded-[17px] [.ungnf_&]:[border:1px_solid_#e0e7f1] [.ungnf_&]:bg-[#fff] [.ungnf_&]:no-underline [.ungnf_&]:text-[#23324a] [.ungnf_&]:[transition:background-color_.15s_ease,_border-color_.15s_ease,_transform_.15s_ease] [.ungnf_&:visited]:box-border [.ungnf_&:visited]:flex [.ungnf_&:visited]:items-center [.ungnf_&:visited]:gap-4 [.ungnf_&:visited]:[padding:19px_20px] [.ungnf_&:visited]:rounded-[17px] [.ungnf_&:visited]:[border:1px_solid_#e0e7f1] [.ungnf_&:visited]:bg-[#fff] [.ungnf_&:visited]:no-underline [.ungnf_&:visited]:text-[#23324a] [.ungnf_&:visited]:[transition:background-color_.15s_ease,_border-color_.15s_ease,_transform_.15s_ease] [.ungnf_&:hover]:border-[#b3c9ed] [.ungnf_&:hover]:bg-[#f8fbff] [.ungnf_&:hover]:[transform:translateY(-1px)] max-[640px]:[.ungnf_&]:gap-3 max-[640px]:[.ungnf_&]:[padding:16px_14px]`}>
                  <span className={`ungnf__link-icon inline-flex items-center justify-center w-[45px] h-[45px] [flex:0_0_45px] rounded-[13px] text-[#2563eb] bg-[#eef4ff] max-[640px]:w-10 max-[640px]:h-10 max-[640px]:basis-10`} aria-hidden="true"><Icon size={21} /></span>
                  <span className={`ungnf__link-copy grid gap-1 flex-1 min-w-0 [&_strong]:text-[#21304b] [&_strong]:text-[15px] [&_strong]:leading-normal [&>_span]:text-[#738099] [&>_span]:text-[13px] [&>_span]:leading-[1.6] [&>_span]:break-keep`}>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </span>
                  <ArrowRight size={19} className={`ungnf__link-arrow [flex:0_0_auto] text-[#899ab6]`} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppContentContainer>
  );
}
