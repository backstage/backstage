import{j as r}from"./jsx-runtime-hv06LKfz.js";import{r as y,b as _,g as L}from"./index-D8-PC79C.js";import{E as F}from"./ExpandMore-BGg9E8oN.js";import{r as M}from"./typeof-ZI2KZN5z.js";import{r as P,a as z}from"./createSvgIcon-Bpme_iea.js";import{u as J}from"./useAsync-7M-9CJJS.js";import{s as x}from"./translation-CeN2fIBA.js";import{m as T}from"./makeStyles-CJp8qHqH.js";import{u as q}from"./SearchContext-DiK7zrkk.js";import{s as W}from"./api-YILTVPsk.js";import{B as X}from"./Box-dSpCvcz2.js";import{T as O}from"./Typography-NhBf-tfS.js";import{A as B,a as H,b as U}from"./AccordionDetails-Cg_0dnVS.js";import{L as $}from"./List-Bi5n8Alr.js";import{D as G}from"./Divider-Gy4Ua46w.js";import{L as K}from"./ListItem-CIr9U5k9.js";import{L as Q}from"./ListItemIcon-sNIMtMKa.js";import{L as k}from"./ListItemText-B_U2MM_y.js";import{u as Y}from"./ApiRef-ByCJBjX1.js";import{u as j}from"./useTranslationRef-DKy5gnX5.js";import{T as Z,a as ee}from"./Tabs-BzQqeg8O.js";import{a as re}from"./FormLabel-CjYxj4ka.js";import{I as ae}from"./InputLabel-BbZEQtws.js";import{S as se}from"./Select-aGy7NPFn.js";import{M as ne}from"./MenuItem-BeuliaIE.js";import{C as te}from"./Checkbox-qt6-_sIU.js";import{C as ie}from"./Chip-D_bIHfxd.js";var oe=function(e){y.useEffect(e,[])},g={},I;function le(){if(I)return g;I=1;var e=M(),n=P();Object.defineProperty(g,"__esModule",{value:!0}),g.default=void 0;var t=n(_()),u=e(z()),l=(0,u.default)(t.createElement("path",{d:"M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"}),"FontDownload");return g.default=l,g}var ce=le();const ue=L(ce),me=T(e=>({icon:{color:e.palette.text.primary},list:{width:"100%"},listItemIcon:{width:"24px",height:"24px"},accordion:{backgroundColor:e.palette.background.paper},accordionSummary:{minHeight:"auto","&.Mui-expanded":{minHeight:"auto"}},accordionSummaryContent:{margin:e.spacing(2,0),"&.Mui-expanded":{margin:e.spacing(2,0)}},accordionDetails:{padding:e.spacing(0,0,1)}})),C=e=>{const n=me(),{filters:t,setPageCursor:u,setTypes:l,term:c,types:i}=q(),m=Y(W),[d,f]=y.useState(!0),{defaultValue:s,name:o,showCounts:A,types:R}=e,{t:h}=j(x),N=()=>f(a=>!a),D=a=>()=>{l(a!==""?[a]:[]),u(void 0)};y.useEffect(()=>{s&&l([s])},[]);const v=[{value:"",name:h("searchType.accordion.allTitle"),icon:r.jsx(ue,{})},...R],V=i[0]||"",{value:w}=J(async()=>{if(!A)return{};const a=await Promise.all(v.map(p=>p.value).map(async p=>{const{numberOfResults:b}=await m.query({term:c,types:p?[p]:[],filters:i.includes(p)||!i.length&&!p?t:{},pageLimit:0});return[p,b!==void 0?h("searchType.accordion.numberOfResults",{number:b>=1e4?">10000":`${b}`}):" -- "]}));return Object.fromEntries(a)},[t,A,c,i]);return r.jsxs(X,{children:[r.jsx(O,{variant:"body2",component:"h2",children:o}),r.jsxs(B,{className:n.accordion,expanded:d,onChange:N,children:[r.jsx(H,{classes:{root:n.accordionSummary,content:n.accordionSummaryContent},expandIcon:r.jsx(F,{className:n.icon}),IconButtonProps:{size:"small"},children:d?h("searchType.accordion.collapse"):v.filter(a=>a.value===V)[0].name}),r.jsx(U,{classes:{root:n.accordionDetails},children:r.jsx($,{className:n.list,component:"nav","aria-label":"filter by type",disablePadding:!0,dense:!0,children:v.map(a=>r.jsxs(y.Fragment,{children:[r.jsx(G,{}),r.jsxs(K,{selected:i[0]===a.value||i.length===0&&a.value==="",onClick:D(a.value),button:!0,children:[r.jsx(Q,{children:y.cloneElement(a.icon,{className:n.listItemIcon})}),r.jsx(k,{primary:a.name,secondary:w&&w[a.value]})]})]},a.value))})})]})]})};C.__docgenInfo={description:"",methods:[],displayName:"SearchTypeAccordion",props:{name:{required:!0,tsType:{name:"string"},description:""},types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
  icon: JSX.Element;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"icon",value:{name:"JSX.Element",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
  icon: JSX.Element;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""},showCounts:{required:!1,tsType:{name:"boolean"},description:""}}};const pe=T(e=>({tabs:{borderBottom:`1px solid ${e.palette.textVerySubtle}`},tab:{height:"50px",fontWeight:e.typography.fontWeightBold,fontSize:e.typography.pxToRem(13),color:e.palette.text.primary,minWidth:"130px"}})),E=e=>{const n=pe(),{setPageCursor:t,setTypes:u,types:l}=q(),{defaultValue:c,types:i}=e,{t:m}=j(x),d=(s,o)=>{u(o!==""?[o]:[]),t(void 0)};y.useEffect(()=>{c&&u([c])},[]);const f=[{value:"",name:m("searchType.tabs.allTitle")},...i];return r.jsx(Z,{"aria-label":"List of search types tabs",className:n.tabs,indicatorColor:"primary",value:l.length===0?"":l[0],onChange:d,children:f.map((s,o)=>r.jsx(ee,{className:n.tab,label:s.name,value:s.value},o))})};E.__docgenInfo={description:"",methods:[],displayName:"SearchTypeTabs",props:{types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""}}};const de=T(e=>({label:{textTransform:"capitalize"},chips:{display:"flex",flexWrap:"wrap",marginTop:e.spacing(1)},chip:{margin:2}})),S=e=>{const{className:n,defaultValue:t,name:u,values:l=[]}=e,c=de(),{types:i,setTypes:m}=q(),{t:d}=j(x);oe(()=>{i.length||(t&&Array.isArray(t)?m(t):t&&m([t]))});const f=s=>{const o=s.target.value;m(o)};return r.jsxs(re,{className:n,variant:"filled",fullWidth:!0,"data-testid":"search-typefilter-next",children:[r.jsx(ae,{className:c.label,margin:"dense",children:u}),r.jsx(se,{multiple:!0,variant:"outlined",value:i,onChange:f,placeholder:d("searchType.allResults"),renderValue:s=>r.jsx("div",{className:c.chips,children:s.map(o=>r.jsx(ie,{label:o,className:c.chip,size:"small"},o))}),children:l.map(s=>r.jsxs(ne,{value:s,children:[r.jsx(te,{checked:i.indexOf(s)>-1}),r.jsx(k,{primary:s})]},s))})]})};S.Accordion=e=>r.jsx(C,{...e});S.Tabs=e=>r.jsx(E,{...e});S.__docgenInfo={description:"@public",methods:[{name:"Accordion",docblock:`A control surface for the search query's "types" property, displayed as a
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
