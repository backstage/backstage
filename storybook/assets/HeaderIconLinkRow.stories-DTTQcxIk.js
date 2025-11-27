import{m as t,j as a}from"./iframe-B6vHPHUS.js";import{I as m}from"./IconLinkVertical-BV1erLX_.js";import"./preload-helper-D9Z9MdNV.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./Link-BCwjV0MZ.js";import"./lodash-CwBbdt2Q.js";import"./index-CG8HQpK_.js";import"./useAnalytics-CHRs9F0l.js";import"./useApp-c9Cmx9JK.js";const c=t(e=>({links:{margin:e.spacing(2,0),display:"grid",gridAutoFlow:"column",gridAutoColumns:"min-content",gridGap:e.spacing(3),wordBreak:"keep-all"}}),{name:"BackstageHeaderIconLinkRow"});function n(e){const{links:o}=e,l=c();return a.jsx("nav",{className:l.links,children:o.map((i,s)=>a.jsx(m,{...i},s+1))})}n.__docgenInfo={description:`HTML nav tag with links mapped inside

@public`,methods:[],displayName:"HeaderIconLinkRow",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
}`,signature:{properties:[{key:"color",value:{name:"union",raw:"'primary' | 'secondary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"}],required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"href",value:{name:"string",required:!1}},{key:"icon",value:{name:"ReactNode",required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"MouseEventHandler",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEventHandler<HTMLAnchorElement>",required:!1}},{key:"title",value:{name:"string",required:!1}}]}}],raw:"IconLinkVerticalProps[]"},description:""}}};const h={title:"Data Display/HeaderIconLinkRow",component:n},r=e=>a.jsx(n,{...e});r.args={links:[{color:"primary",disabled:!1,href:"https://google.com",label:"primary",title:"title"},{color:"secondary",disabled:!1,href:"https://google.com",label:"secondary",title:"title-2"}]};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
}`,signature:{properties:[{key:"color",value:{name:"union",raw:"'primary' | 'secondary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"}],required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"href",value:{name:"string",required:!1}},{key:"icon",value:{name:"ReactNode",required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"MouseEventHandler",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEventHandler<HTMLAnchorElement>",required:!1}},{key:"title",value:{name:"string",required:!1}}]}}],raw:"IconLinkVerticalProps[]"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: Props) => <HeaderIconLinkRow {...args} />",...r.parameters?.docs?.source}}};const w=["Default"];export{r as Default,w as __namedExportsOrder,h as default};
