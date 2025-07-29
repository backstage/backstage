import{j as e}from"./jsx-runtime-CvpxdxdE.js";import{r as y,b as L}from"./index-DSHF18-l.js";import{d as D}from"./ExpandMore-CpC1TpJa.js";import{i as P}from"./interopRequireDefault-Y9pwbXtE.js";import{r as z,i as J}from"./createSvgIcon-Cq_PMNt4.js";import{u as M}from"./useAsync-W0CErRou.js";import{s as b}from"./translation-4rNZwzA9.js";import{m as x}from"./makeStyles-yUUo8jj4.js";import{u as T}from"./SearchContext-BYBNj33Q.js";import{s as W}from"./api-mJEpP5Oi.js";import{B as X}from"./Box-CBL4LtOb.js";import{T as O}from"./Typography-C4wK928C.js";import{A as B,a as H,b as $}from"./AccordionDetails-BzKcYNPh.js";import{L as F}from"./List-q1Ps7jPn.js";import{D as U}from"./Divider-CQVpOw77.js";import{L as G}from"./ListItem-DZU9uVXE.js";import{L as K}from"./ListItemIcon-Cl65eXMu.js";import{L as w}from"./ListItemText-Bhrk3tXi.js";import{u as Q}from"./ApiRef-DDVPwL0h.js";import{u as q}from"./useTranslationRef-m705PC51.js";import{T as Y,a as Z}from"./Tabs-BdK99h7M.js";import{a as ee}from"./FormLabel-DvHirao7.js";import{I as re}from"./InputLabel-DxkgtSbC.js";import{S as ae}from"./Select-0NG0Spv4.js";import{C as se}from"./Chip-DFAyf-Ib.js";import{M as te}from"./MenuItem-Bq-v_O3-.js";import{C as ne}from"./Checkbox-DzXUD5yt.js";var ie=function(r){y.useEffect(r,[])},j={},oe=P,le=J;Object.defineProperty(j,"__esModule",{value:!0});var C=j.default=void 0,ce=le(L()),ue=oe(z()),me=(0,ue.default)(ce.createElement("path",{d:"M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"}),"FontDownload");C=j.default=me;const pe=x(r=>({icon:{color:r.palette.text.primary},list:{width:"100%"},listItemIcon:{width:"24px",height:"24px"},accordion:{backgroundColor:r.palette.background.paper},accordionSummary:{minHeight:"auto","&.Mui-expanded":{minHeight:"auto"}},accordionSummaryContent:{margin:r.spacing(2,0),"&.Mui-expanded":{margin:r.spacing(2,0)}},accordionDetails:{padding:r.spacing(0,0,1)}})),I=r=>{const t=pe(),{filters:o,setPageCursor:p,setTypes:c,term:l,types:n}=T(),u=Q(W),[d,f]=y.useState(!0),{defaultValue:s,name:i,showCounts:A,types:_}=r,{t:g}=q(b),N=()=>f(a=>!a),R=a=>()=>{c(a!==""?[a]:[]),p(void 0)};y.useEffect(()=>{s&&c([s])},[]);const h=[{value:"",name:g("searchType.accordion.allTitle"),icon:e.jsx(C,{})},..._],V=n[0]||"",{value:k}=M(async()=>{if(!A)return{};const a=await Promise.all(h.map(m=>m.value).map(async m=>{const{numberOfResults:v}=await u.query({term:l,types:m?[m]:[],filters:n.includes(m)||!n.length&&!m?o:{},pageLimit:0});return[m,v!==void 0?g("searchType.accordion.numberOfResults",{number:v>=1e4?">10000":`${v}`}):" -- "]}));return Object.fromEntries(a)},[o,A,l,n]);return e.jsxs(X,{children:[e.jsx(O,{variant:"body2",component:"h2",children:i}),e.jsxs(B,{className:t.accordion,expanded:d,onChange:N,children:[e.jsx(H,{classes:{root:t.accordionSummary,content:t.accordionSummaryContent},expandIcon:e.jsx(D,{className:t.icon}),IconButtonProps:{size:"small"},children:d?g("searchType.accordion.collapse"):h.filter(a=>a.value===V)[0].name}),e.jsx($,{classes:{root:t.accordionDetails},children:e.jsx(F,{className:t.list,component:"nav","aria-label":"filter by type",disablePadding:!0,dense:!0,children:h.map(a=>e.jsxs(y.Fragment,{children:[e.jsx(U,{}),e.jsxs(G,{selected:n[0]===a.value||n.length===0&&a.value==="",onClick:R(a.value),button:!0,children:[e.jsx(K,{children:y.cloneElement(a.icon,{className:t.listItemIcon})}),e.jsx(w,{primary:a.name,secondary:k&&k[a.value]})]})]},a.value))})})]})]})};I.__docgenInfo={description:"",methods:[],displayName:"SearchTypeAccordion",props:{name:{required:!0,tsType:{name:"string"},description:""},types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
  icon: JSX.Element;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"icon",value:{name:"JSX.Element",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
  icon: JSX.Element;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""},showCounts:{required:!1,tsType:{name:"boolean"},description:""}}};const de=x(r=>({tabs:{borderBottom:`1px solid ${r.palette.textVerySubtle}`},tab:{height:"50px",fontWeight:r.typography.fontWeightBold,fontSize:r.typography.pxToRem(13),color:r.palette.text.primary,minWidth:"130px"}})),E=r=>{const t=de(),{setPageCursor:o,setTypes:p,types:c}=T(),{defaultValue:l,types:n}=r,{t:u}=q(b),d=(s,i)=>{p(i!==""?[i]:[]),o(void 0)};y.useEffect(()=>{l&&p([l])},[]);const f=[{value:"",name:u("searchType.tabs.allTitle")},...n];return e.jsx(Y,{"aria-label":"List of search types tabs",className:t.tabs,indicatorColor:"primary",value:c.length===0?"":c[0],onChange:d,children:f.map((s,i)=>e.jsx(Z,{className:t.tab,label:s.name,value:s.value},i))})};E.__docgenInfo={description:"",methods:[],displayName:"SearchTypeTabs",props:{types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""}}};const ye=x(r=>({label:{textTransform:"capitalize"},chips:{display:"flex",flexWrap:"wrap",marginTop:r.spacing(1)},chip:{margin:2}})),S=r=>{const{className:t,defaultValue:o,name:p,values:c=[]}=r,l=ye(),{types:n,setTypes:u}=T(),{t:d}=q(b);ie(()=>{n.length||(o&&Array.isArray(o)?u(o):o&&u([o]))});const f=s=>{const i=s.target.value;u(i)};return e.jsxs(ee,{className:t,variant:"filled",fullWidth:!0,"data-testid":"search-typefilter-next",children:[e.jsx(re,{className:l.label,margin:"dense",children:p}),e.jsx(ae,{multiple:!0,variant:"outlined",value:n,onChange:f,placeholder:d("searchType.allResults"),renderValue:s=>e.jsx("div",{className:l.chips,children:s.map(i=>e.jsx(se,{label:i,className:l.chip,size:"small"},i))}),children:c.map(s=>e.jsxs(te,{value:s,children:[e.jsx(ne,{checked:n.indexOf(s)>-1}),e.jsx(w,{primary:s})]},s))})]})};S.Accordion=r=>e.jsx(I,{...r});S.Tabs=r=>e.jsx(E,{...r});S.__docgenInfo={description:"@public",methods:[{name:"Accordion",docblock:`A control surface for the search query's "types" property, displayed as a
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
