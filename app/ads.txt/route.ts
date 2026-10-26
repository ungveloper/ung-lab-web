const publisher=process.env.ADSENSE_PUBLISHER_ID?.trim()??"";
export function GET(){
  if(!/^ca-pub-\d{16}$/.test(publisher))return new Response("Not Found\n",{status:404,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}});
  return new Response(`google.com, ${publisher.slice(3)}, DIRECT, f08c47fec0942fa0\n`,{status:200,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=3600"}});
}
