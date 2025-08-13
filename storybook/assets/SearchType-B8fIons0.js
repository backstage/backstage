import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{r as p}from"./index-CTjT7uj6.js";import{d as L}from"./ExpandMore-BbHQRYUg.js";import{i as D}from"./interopRequireDefault-Y9pwbXtE.js";import{r as P,i as z}from"./createSvgIcon-C7DOmWEG.js";import{u as J}from"./useAsync-CXA3qup_.js";import{s as b}from"./translation-BrGRs-hL.js";import{m as x}from"./makeStyles-CRB_T0k9.js";import{u as T}from"./SearchContext-NUeqQOQ4.js";import{s as M}from"./api-B335RvSG.js";import{B as W}from"./Box-DU2WS7ls.js";import{T as X}from"./Typography-D5Gm01bp.js";import{A as O,a as B,b as H}from"./AccordionDetails-Cdnq4DJS.js";import{L as $}from"./List-B21WyO9K.js";import{D as F}from"./Divider-BAm-5afo.js";import{L as U}from"./ListItem-DrBaGnGs.js";import{L as G}from"./ListItemIcon-CM5i1NWL.js";import{L as w}from"./ListItemText-BQG6-PBZ.js";import{u as K}from"./ApiRef-CqkoWjZn.js";import{u as q}from"./useTranslationRef-Bfx90Ud1.js";import{T as Q,a as Y}from"./Tabs-Cc5fYxtr.js";import{a as Z}from"./FormLabel-D6jOsxCS.js";import{I as ee}from"./InputLabel-Rh6717bL.js";import{S as re}from"./Select-ChjCOIHu.js";import{C as ae}from"./Chip-Ayq5cSOe.js";import{M as se}from"./MenuItem-dYg-3nZn.js";import{C as te}from"./Checkbox-D-O8ONT_.js";var ne=function(r){p.useEffect(r,[])},j={},ie=D,oe=z;Object.defineProperty(j,"__esModule",{value:!0});var C=j.default=void 0,le=oe(p),ce=ie(P()),ue=(0,ce.default)(le.createElement("path",{d:"M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"}),"FontDownload");C=j.default=ue;const me=x(r=>({icon:{color:r.palette.text.primary},list:{width:"100%"},listItemIcon:{width:"24px",height:"24px"},accordion:{backgroundColor:r.palette.background.paper},accordionSummary:{minHeight:"auto","&.Mui-expanded":{minHeight:"auto"}},accordionSummaryContent:{margin:r.spacing(2,0),"&.Mui-expanded":{margin:r.spacing(2,0)}},accordionDetails:{padding:r.spacing(0,0,1)}})),I=r=>{const t=me(),{filters:o,setPageCursor:d,setTypes:c,term:l,types:n}=T(),u=K(M),[y,f]=p.useState(!0),{defaultValue:s,name:i,showCounts:A,types:_}=r,{t:g}=q(b),N=()=>f(a=>!a),R=a=>()=>{c(a!==""?[a]:[]),d(void 0)};p.useEffect(()=>{s&&c([s])},[]);const h=[{value:"",name:g("searchType.accordion.allTitle"),icon:e.jsx(C,{})},..._],V=n[0]||"",{value:k}=J(async()=>{if(!A)return{};const a=await Promise.all(h.map(m=>m.value).map(async m=>{const{numberOfResults:v}=await u.query({term:l,types:m?[m]:[],filters:n.includes(m)||!n.length&&!m?o:{},pageLimit:0});return[m,v!==void 0?g("searchType.accordion.numberOfResults",{number:v>=1e4?">10000":`${v}`}):" -- "]}));return Object.fromEntries(a)},[o,A,l,n]);return e.jsxs(W,{children:[e.jsx(X,{variant:"body2",component:"h2",children:i}),e.jsxs(O,{className:t.accordion,expanded:y,onChange:N,children:[e.jsx(B,{classes:{root:t.accordionSummary,content:t.accordionSummaryContent},expandIcon:e.jsx(L,{className:t.icon}),IconButtonProps:{size:"small"},children:y?g("searchType.accordion.collapse"):h.filter(a=>a.value===V)[0].name}),e.jsx(H,{classes:{root:t.accordionDetails},children:e.jsx($,{className:t.list,component:"nav","aria-label":"filter by type",disablePadding:!0,dense:!0,children:h.map(a=>e.jsxs(p.Fragment,{children:[e.jsx(F,{}),e.jsxs(U,{selected:n[0]===a.value||n.length===0&&a.value==="",onClick:R(a.value),button:!0,children:[e.jsx(G,{children:p.cloneElement(a.icon,{className:t.listItemIcon})}),e.jsx(w,{primary:a.name,secondary:k&&k[a.value]})]})]},a.value))})})]})]})};I.__docgenInfo={description:"",methods:[],displayName:"SearchTypeAccordion",props:{name:{required:!0,tsType:{name:"string"},description:""},types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
  icon: JSX.Element;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"icon",value:{name:"JSX.Element",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
  icon: JSX.Element;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""},showCounts:{required:!1,tsType:{name:"boolean"},description:""}}};const pe=x(r=>({tabs:{borderBottom:`1px solid ${r.palette.textVerySubtle}`},tab:{height:"50px",fontWeight:r.typography.fontWeightBold,fontSize:r.typography.pxToRem(13),color:r.palette.text.primary,minWidth:"130px"}})),E=r=>{const t=pe(),{setPageCursor:o,setTypes:d,types:c}=T(),{defaultValue:l,types:n}=r,{t:u}=q(b),y=(s,i)=>{d(i!==""?[i]:[]),o(void 0)};p.useEffect(()=>{l&&d([l])},[]);const f=[{value:"",name:u("searchType.tabs.allTitle")},...n];return e.jsx(Q,{"aria-label":"List of search types tabs",className:t.tabs,indicatorColor:"primary",value:c.length===0?"":c[0],onChange:y,children:f.map((s,i)=>e.jsx(Y,{className:t.tab,label:s.name,value:s.value},i))})};E.__docgenInfo={description:"",methods:[],displayName:"SearchTypeTabs",props:{types:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  name: string;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:`Array<{
  value: string;
  name: string;
}>`},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""}}};const de=x(r=>({label:{textTransform:"capitalize"},chips:{display:"flex",flexWrap:"wrap",marginTop:r.spacing(1)},chip:{margin:2}})),S=r=>{const{className:t,defaultValue:o,name:d,values:c=[]}=r,l=de(),{types:n,setTypes:u}=T(),{t:y}=q(b);ne(()=>{n.length||(o&&Array.isArray(o)?u(o):o&&u([o]))});const f=s=>{const i=s.target.value;u(i)};return e.jsxs(Z,{className:t,variant:"filled",fullWidth:!0,"data-testid":"search-typefilter-next",children:[e.jsx(ee,{className:l.label,margin:"dense",children:d}),e.jsx(re,{multiple:!0,variant:"outlined",value:n,onChange:f,placeholder:y("searchType.allResults"),renderValue:s=>e.jsx("div",{className:l.chips,children:s.map(i=>e.jsx(ae,{label:i,className:l.chip,size:"small"},i))}),children:c.map(s=>e.jsxs(se,{value:s,children:[e.jsx(te,{checked:n.indexOf(s)>-1}),e.jsx(w,{primary:s})]},s))})]})};S.Accordion=r=>e.jsx(I,{...r});S.Tabs=r=>e.jsx(E,{...r});S.__docgenInfo={description:"@public",methods:[{name:"Accordion",docblock:`A control surface for the search query's "types" property, displayed as a
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
