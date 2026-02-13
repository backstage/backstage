import{r as p,aA as F,aB as J,aC as M,aD as P,V as z,J as W,F as T,j as r,d as X}from"./iframe-DBsVXRYe.js";import{E as B}from"./ExpandMore-X1Sw9hIC.js";import{u as O}from"./useAsync-CBnGfjig.js";import{s as q}from"./translation-DCN-qCzN.js";import{m as j}from"./makeStyles-u8aTytdp.js";import{u as A}from"./SearchContext-Bmxfx14E.js";import{s as H}from"./api-DsxXV-qP.js";import{B as U}from"./Box-DM8WpBiE.js";import{A as $,a as G,b as K}from"./AccordionDetails-NV6-MnS3.js";import{L as Q}from"./List-CIVoJXzy.js";import{D as Y}from"./Divider-DEXssYkW.js";import{L as Z}from"./ListItem-DQ9bn4c-.js";import{L as ee}from"./ListItemIcon-DrBKcuO8.js";import{L as k}from"./ListItemText-Udvvf9eP.js";import{T as re,a as ae}from"./Tabs-BH8rs-Pq.js";import{a as se}from"./FormLabel-BDMi2SjX.js";import{I as ne}from"./InputLabel-DyH2lMcA.js";import{S as te}from"./Select-yW0Lhu1K.js";import{M as ie}from"./MenuItem-CaWLJ_Iy.js";import{C as oe}from"./Checkbox-DcJ65tI_.js";import{C as le}from"./Chip-BhYQb-0b.js";var ce=function(e){p.useEffect(e,[])},h={},I;function ue(){if(I)return h;I=1;var e=F(),n=J();Object.defineProperty(h,"__esModule",{value:!0}),h.default=void 0;var t=n(M()),u=e(P()),l=(0,u.default)(t.createElement("path",{d:"M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"}),"FontDownload");return h.default=l,h}var pe=ue();const me=z(pe),de=j(e=>({icon:{color:e.palette.text.primary},list:{width:"100%"},listItemIcon:{width:"24px",height:"24px"},accordion:{backgroundColor:e.palette.background.paper},accordionSummary:{minHeight:"auto","&.Mui-expanded":{minHeight:"auto"}},accordionSummaryContent:{margin:e.spacing(2,0),"&.Mui-expanded":{margin:e.spacing(2,0)}},accordionDetails:{padding:e.spacing(0,0,1)}})),E=e=>{const n=de(),{filters:t,setPageCursor:u,setTypes:l,term:c,types:i}=A(),m=W(H),[y,f]=p.useState(!0),{defaultValue:s,name:o,showCounts:w,types:D}=e,{t:v}=T(q),g=p.useRef(null),N=()=>f(a=>!a),V=a=>()=>{l(a!==""?[a]:[]),u(void 0)};p.useEffect(()=>{s&&l([s])},[]);const b=[{value:"",name:v("searchType.accordion.allTitle"),icon:r.jsx(me,{})},...D],_=i[0]||"",{value:C}=O(async()=>{if(!w)return{};g.current&&g.current.abort();const a=new AbortController;g.current=a;const L=await Promise.all(b.map(d=>d.value).map(async d=>{const{numberOfResults:x}=await m.query({term:c,types:d?[d]:[],filters:i.includes(d)||!i.length&&!d?t:{},pageLimit:0},{signal:a.signal});return[d,x!==void 0?v("searchType.accordion.numberOfResults",{number:x>=1e4?">10000":`${x}`}):" -- "]}));return Object.fromEntries(L)},[t,w,c,i]);return p.useEffect(()=>()=>{g.current&&g.current.abort()},[]),r.jsxs(U,{children:[r.jsx(X,{variant:"body2",component:"h2",children:o}),r.jsxs($,{className:n.accordion,expanded:y,onChange:N,children:[r.jsx(G,{classes:{root:n.accordionSummary,content:n.accordionSummaryContent},expandIcon:r.jsx(B,{className:n.icon}),IconButtonProps:{size:"small"},children:y?v("searchType.accordion.collapse"):b.filter(a=>a.value===_)[0].name}),r.jsx(K,{classes:{root:n.accordionDetails},children:r.jsx(Q,{className:n.list,component:"nav","aria-label":"filter by type",disablePadding:!0,dense:!0,children:b.map(a=>r.jsxs(p.Fragment,{children:[r.jsx(Y,{}),r.jsxs(Z,{selected:i[0]===a.value||i.length===0&&a.value==="",onClick:V(a.value),button:!0,children:[r.jsx(ee,{children:p.cloneElement(a.icon,{className:n.listItemIcon})}),r.jsx(k,{primary:a.name,secondary:C&&C[a.value]})]})]},a.value))})})]})]})};E.__docgenInfo={description:"",methods:[],displayName:"SearchTypeAccordion",props:{name:{required:!0,tsType:{name:"string"},description:""},types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
  icon: JSX.Element;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"icon",value:{name:"JSX.Element",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
  icon: JSX.Element;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""},showCounts:{required:!1,tsType:{name:"boolean"},description:""}}};const ye=j(e=>({tabs:{borderBottom:`1px solid ${e.palette.textVerySubtle}`},tab:{height:"50px",fontWeight:e.typography.fontWeightBold,fontSize:e.typography.pxToRem(13),color:e.palette.text.primary,minWidth:"130px"}})),R=e=>{const n=ye(),{setPageCursor:t,setTypes:u,types:l}=A(),{defaultValue:c,types:i}=e,{t:m}=T(q),y=(s,o)=>{u(o!==""?[o]:[]),t(void 0)};p.useEffect(()=>{c&&u([c])},[]);const f=[{value:"",name:m("searchType.tabs.allTitle")},...i];return r.jsx(re,{"aria-label":"List of search types tabs",className:n.tabs,indicatorColor:"primary",value:l.length===0?"":l[0],onChange:y,children:f.map((s,o)=>r.jsx(ae,{className:n.tab,label:s.name,value:s.value},o))})};R.__docgenInfo={description:"",methods:[],displayName:"SearchTypeTabs",props:{types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""}}};const fe=j(e=>({label:{textTransform:"capitalize"},chips:{display:"flex",flexWrap:"wrap",marginTop:e.spacing(1)},chip:{margin:2}})),S=e=>{const{className:n,defaultValue:t,name:u,values:l=[]}=e,c=fe(),{types:i,setTypes:m}=A(),{t:y}=T(q);ce(()=>{i.length||(t&&Array.isArray(t)?m(t):t&&m([t]))});const f=s=>{const o=s.target.value;m(o)};return r.jsxs(se,{className:n,variant:"filled",fullWidth:!0,"data-testid":"search-typefilter-next",children:[r.jsx(ne,{className:c.label,margin:"dense",children:u}),r.jsx(te,{multiple:!0,variant:"outlined",value:i,onChange:f,placeholder:y("searchType.allResults"),renderValue:s=>r.jsx("div",{className:c.chips,children:s.map(o=>r.jsx(le,{label:o,className:c.chip,size:"small"},o))}),children:l.map(s=>r.jsxs(ie,{value:s,children:[r.jsx(oe,{checked:i.indexOf(s)>-1}),r.jsx(k,{primary:s})]},s))})]})};S.Accordion=e=>r.jsx(E,{...e});S.Tabs=e=>r.jsx(R,{...e});S.__docgenInfo={description:"@public",methods:[{name:"Accordion",docblock:`A control surface for the search query's "types" property, displayed as a
single-select collapsible accordion suitable for use in faceted search UIs.
@public`,modifiers:["static"],params:[{name:"props",optional:!1,type:{name:"signature",type:"object",raw:`{
  name: string;
  types: Array<{
    value: string;
    name: string;
    icon: JSX.Element;
  }>;
  defaultValue?: string;
  showCounts?: boolean;
}`,signature:{properties:[{key:"name",value:{name:"string",required:!0}},{key:"types",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
  icon: JSX.Element;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"icon",value:{name:"JSX.Element",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
  icon: JSX.Element;
}>`,required:!0}},{key:"defaultValue",value:{name:"string",required:!1}},{key:"showCounts",value:{name:"boolean",required:!1}}]},alias:"SearchTypeAccordionProps"}}],returns:null,description:`A control surface for the search query's "types" property, displayed as a
single-select collapsible accordion suitable for use in faceted search UIs.`},{name:"Tabs",docblock:`A control surface for the search query's "types" property, displayed as a
tabs suitable for use in faceted search UIs.
@public`,modifiers:["static"],params:[{name:"props",optional:!1,type:{name:"signature",type:"object",raw:`{
  types: Array<{
    value: string;
    name: string;
  }>;
  defaultValue?: string;
}`,signature:{properties:[{key:"types",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
}>`,required:!0}},{key:"defaultValue",value:{name:"string",required:!1}}]},alias:"SearchTypeTabsProps"}}],returns:null,description:`A control surface for the search query's "types" property, displayed as a
tabs suitable for use in faceted search UIs.`}],displayName:"SearchType",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""}}};export{S};
