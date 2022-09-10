import{r as d,o as g,a as m,b as o,c as n,d as s,F as u,e as p,f as h,n as _,t as f}from"./index.2bf5b3fe.js";const b={key:0},k=s("h4",{class:"text-2xl font-medium text-white mb-4"},"Trending",-1),y={class:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4"},v=["onClick"],x={class:"text-sm sm:text-base absolute bottom-0 w-full p-3 backdrop-blur backdrop-brightness-50"},j={__name:"Home",emits:{openAnime:a=>typeof a=="string"},setup(a){const e=d({loading:!0,error:null,search:"",trending:{}}),c=async()=>{e.loading=!0,e.error=null,e.trending={};try{const t=await fetch("https://consumet-api.herokuapp.com/meta/anilist/trending?perPage=10",{method:"GET",headers:{"Content-Type":"application/json"}});e.trending=await t.json()}catch(t){e.error=t}finally{e.loading=!1}};return g(()=>c(m)),(t,w)=>{var i,l;return(l=(i=e.trending)==null?void 0:i.results)!=null&&l.length?(o(),n("article",b,[k,s("section",y,[(o(!0),n(u,null,p(e.trending.results,r=>(o(),n("figure",{key:r.id,onClick:B=>t.$emit("openAnime",r.id),class:"relative h-60 sm:h-80 w-full cursor-pointer rounded-2xl overflow-hidden text-white hover:ring-4 hover:ring-neutral-600 bg-cover",style:_({backgroundImage:`url(${r.image})`})},[s("div",x,f(r.title.romaji),1)],12,v))),128))])])):h("",!0)}}};export{j as default};