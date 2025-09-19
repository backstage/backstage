import{r as y,ag as _,ah as L,ai as F,aj as M,s as P,m as x,n as z,k as T,j as a,d as J}from"./iframe-hd6BgcQH.js";import{E as W}from"./ExpandMore-C7-67hd9.js";import{u as X}from"./useAsync-DlvFpJJJ.js";import{s as q}from"./translation-BeOxiZJ4.js";import{u as j}from"./SearchContext-BtDsvwkw.js";import{s as O}from"./api-Bev5I2Sd.js";import{B}from"./Box-C4_Hx4tK.js";import{A as H,a as U,b as $}from"./AccordionDetails-DosuP5Ed.js";import{L as G}from"./List-Eydl9qQR.js";import{D as K}from"./Divider-BsrVsHFl.js";import{L as Q}from"./ListItem-BuICECdF.js";import{L as Y}from"./ListItemIcon-B1o-6Fru.js";import{L as I}from"./ListItemText-B0MXj_oA.js";import{T as Z,a as ee}from"./Tabs-DWz-YJuh.js";import{a as ae}from"./FormLabel-CeQe378n.js";import{I as re}from"./InputLabel-CWkIs-bu.js";import{S as se}from"./Select-FOK1voHD.js";import{M as ne}from"./MenuItem-3YpUlPNQ.js";import{C as te}from"./Checkbox-CoxSolwl.js";import{C as ie}from"./Chip-DaEx1ypY.js";var oe=function(e){y.useEffect(e,[])},g={},w;function le(){if(w)return g;w=1;var e=_(),n=L();Object.defineProperty(g,"__esModule",{value:!0}),g.default=void 0;var t=n(F()),u=e(M()),l=(0,u.default)(t.createElement("path",{d:"M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"}),"FontDownload");return g.default=l,g}var ce=le();const ue=P(ce),pe=x(e=>({icon:{color:e.palette.text.primary},list:{width:"100%"},listItemIcon:{width:"24px",height:"24px"},accordion:{backgroundColor:e.palette.background.paper},accordionSummary:{minHeight:"auto","&.Mui-expanded":{minHeight:"auto"}},accordionSummaryContent:{margin:e.spacing(2,0),"&.Mui-expanded":{margin:e.spacing(2,0)}},accordionDetails:{padding:e.spacing(0,0,1)}})),C=e=>{const n=pe(),{filters:t,setPageCursor:u,setTypes:l,term:c,types:i}=j(),p=z(O),[d,f]=y.useState(!0),{defaultValue:s,name:o,showCounts:A,types:R}=e,{t:h}=T(q),N=()=>f(r=>!r),D=r=>()=>{l(r!==""?[r]:[]),u(void 0)};y.useEffect(()=>{s&&l([s])},[]);const v=[{value:"",name:h("searchType.accordion.allTitle"),icon:a.jsx(ue,{})},...R],V=i[0]||"",{value:k}=X(async()=>{if(!A)return{};const r=await Promise.all(v.map(m=>m.value).map(async m=>{const{numberOfResults:b}=await p.query({term:c,types:m?[m]:[],filters:i.includes(m)||!i.length&&!m?t:{},pageLimit:0});return[m,b!==void 0?h("searchType.accordion.numberOfResults",{number:b>=1e4?">10000":`${b}`}):" -- "]}));return Object.fromEntries(r)},[t,A,c,i]);return a.jsxs(B,{children:[a.jsx(J,{variant:"body2",component:"h2",children:o}),a.jsxs(H,{className:n.accordion,expanded:d,onChange:N,children:[a.jsx(U,{classes:{root:n.accordionSummary,content:n.accordionSummaryContent},expandIcon:a.jsx(W,{className:n.icon}),IconButtonProps:{size:"small"},children:d?h("searchType.accordion.collapse"):v.filter(r=>r.value===V)[0].name}),a.jsx($,{classes:{root:n.accordionDetails},children:a.jsx(G,{className:n.list,component:"nav","aria-label":"filter by type",disablePadding:!0,dense:!0,children:v.map(r=>a.jsxs(y.Fragment,{children:[a.jsx(K,{}),a.jsxs(Q,{selected:i[0]===r.value||i.length===0&&r.value==="",onClick:D(r.value),button:!0,children:[a.jsx(Y,{children:y.cloneElement(r.icon,{className:n.listItemIcon})}),a.jsx(I,{primary:r.name,secondary:k&&k[r.value]})]})]},r.value))})})]})]})};C.__docgenInfo={description:"",methods:[],displayName:"SearchTypeAccordion",props:{name:{required:!0,tsType:{name:"string"},description:""},types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
  icon: JSX.Element;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"icon",value:{name:"JSX.Element",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
  icon: JSX.Element;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""},showCounts:{required:!1,tsType:{name:"boolean"},description:""}}};const me=x(e=>({tabs:{borderBottom:`1px solid ${e.palette.textVerySubtle}`},tab:{height:"50px",fontWeight:e.typography.fontWeightBold,fontSize:e.typography.pxToRem(13),color:e.palette.text.primary,minWidth:"130px"}})),E=e=>{const n=me(),{setPageCursor:t,setTypes:u,types:l}=j(),{defaultValue:c,types:i}=e,{t:p}=T(q),d=(s,o)=>{u(o!==""?[o]:[]),t(void 0)};y.useEffect(()=>{c&&u([c])},[]);const f=[{value:"",name:p("searchType.tabs.allTitle")},...i];return a.jsx(Z,{"aria-label":"List of search types tabs",className:n.tabs,indicatorColor:"primary",value:l.length===0?"":l[0],onChange:d,children:f.map((s,o)=>a.jsx(ee,{className:n.tab,label:s.name,value:s.value},o))})};E.__docgenInfo={description:"",methods:[],displayName:"SearchTypeTabs",props:{types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""}}};const de=x(e=>({label:{textTransform:"capitalize"},chips:{display:"flex",flexWrap:"wrap",marginTop:e.spacing(1)},chip:{margin:2}})),S=e=>{const{className:n,defaultValue:t,name:u,values:l=[]}=e,c=de(),{types:i,setTypes:p}=j(),{t:d}=T(q);oe(()=>{i.length||(t&&Array.isArray(t)?p(t):t&&p([t]))});const f=s=>{const o=s.target.value;p(o)};return a.jsxs(ae,{className:n,variant:"filled",fullWidth:!0,"data-testid":"search-typefilter-next",children:[a.jsx(re,{className:c.label,margin:"dense",children:u}),a.jsx(se,{multiple:!0,variant:"outlined",value:i,onChange:f,placeholder:d("searchType.allResults"),renderValue:s=>a.jsx("div",{className:c.chips,children:s.map(o=>a.jsx(ie,{label:o,className:c.chip,size:"small"},o))}),children:l.map(s=>a.jsxs(ne,{value:s,children:[a.jsx(te,{checked:i.indexOf(s)>-1}),a.jsx(I,{primary:s})]},s))})]})};S.Accordion=e=>a.jsx(C,{...e});S.Tabs=e=>a.jsx(E,{...e});S.__docgenInfo={description:"@public",methods:[{name:"Accordion",docblock:`A control surface for the search query's "types" property, displayed as a
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
