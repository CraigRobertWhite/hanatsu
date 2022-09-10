import{r as f,o as _,a as x,b as t,c as y,w as k,T as v,d as s,e as p,u as i,f as r,t as l,F as m,g as u,h as w,i as h,j as b,n as E}from"./index.c7ad4500.js";const T={key:0,class:"flex h-[50vh] items-center justify-center"},j={key:1,class:"h-[50vh] flex flex-col items-center justify-center text-white"},C=r("h6",{class:"sm:text-xl font-medium mt-2 mb-4"},"An error occurred",-1),B={key:2},R={class:"text-2xl font-medium text-white mb-4"},A={class:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4"},P=["onClick"],z={class:"text-sm sm:text-base w-full p-3 backdrop-blur backdrop-brightness-50"},N={__name:"Home",emits:{openAnime:d=>typeof d=="string"},setup(d){const e=f({loading:!0,loadingError:null,search:"",categories:[]}),g=async()=>{e.loading=!0,e.loadingError=null,e.categories=[];try{const o=await fetch("https://consumet-api.herokuapp.com/meta/anilist/trending?perPage=10",{method:"GET",headers:{"Content-Type":"application/json"}}),c=await fetch("https://consumet-api.herokuapp.com/meta/anilist/popular?perPage=10",{method:"GET",headers:{"Content-Type":"application/json"}}),a=await fetch("https://consumet-api.herokuapp.com/meta/anilist/recent-episodes?perPage=10",{method:"GET",headers:{"Content-Type":"application/json"}});if([o,c,a].some(n=>!n.ok))throw Error(response.statusText);e.categories.push({name:"Trending",...await o.json()}),e.categories.push({name:"Popular",...await c.json()}),e.categories.push({name:"Recently Released",...await a.json()})}catch(o){e.loadingError=o}finally{e.loading=!1}};return _(()=>g(x)),(o,c)=>(t(),y(v,{"enter-active-class":"duration-300 ease-out","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"duration-200 ease-in","leave-from-class":"opacity-100","leave-to-class":"opacity-0",mode:"out-in"},{default:k(()=>[e.loading?(t(),s("div",T,[p(i(h),{icon:i(w),size:"2xl",class:"text-red-600 animate-spin"},null,8,["icon"])])):e.loadingError?(t(),s("div",j,[p(i(h),{icon:i(b),size:"2xl",class:"text-red-600"},null,8,["icon"]),C,r("code",null,l(e.loadingError),1)])):(t(),s("div",B,[(t(!0),s(m,null,u(e.categories,a=>(t(),s("article",{key:a.name,class:"mb-12"},[r("h4",R,l(a.name),1),r("section",A,[(t(!0),s(m,null,u(a.results,n=>(t(),s("figure",{key:n.id,onClick:F=>o.$emit("openAnime",n.id),class:"h-60 sm:h-80 w-full cursor-pointer rounded-2xl overflow-hidden text-white hover:ring-4 hover:ring-neutral-600 bg-cover flex items-end",style:E({backgroundImage:`url(${n.image})`})},[r("div",z,l(n.title.romaji),1)],12,P))),128))])]))),128))]))]),_:1}))}};export{N as default};
