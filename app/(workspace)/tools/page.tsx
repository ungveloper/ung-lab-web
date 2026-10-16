import type {Metadata} from "next";
import {ToolBrowsePage} from "@/components/tool-browse-page";

export const metadata:Metadata={title:"모든 기능 보기",description:"PDF, 이미지, 문서 도구를 검색하고 바로 사용하세요.",alternates:{canonical:"/tools"}};
export default function Page(){return <ToolBrowsePage/>}
