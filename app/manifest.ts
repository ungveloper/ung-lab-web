import type {MetadataRoute} from "next";
export default function manifest():MetadataRoute.Manifest{
  return {name:"웅이연구소",short_name:"웅이연구소",description:"PDF, 이미지, 문서 작업을 간편하게 처리하는 웹 도구 모음",start_url:"/",scope:"/",display:"standalone",background_color:"#ffffff",theme_color:"#287bfa",icons:[
    {src:"/android-chrome-192x192.png",sizes:"192x192",type:"image/png"},
    {src:"/android-chrome-512x512.png",sizes:"512x512",type:"image/png"},
  ]};
}
