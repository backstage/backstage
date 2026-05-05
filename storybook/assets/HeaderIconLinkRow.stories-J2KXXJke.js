import{j as a}from"./iframe-CBMR_Zns.js";import{I as t}from"./IconLinkVertical-cH-I4iCq.js";import{m}from"./makeStyles-sF8PfItD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BkiKfy6N.js";import"./Box-DRo0xUou.js";import"./styled-Fdl9HABt.js";import"./Link-DSfdg0tL.js";import"./lodash-CkAY2xSD.js";import"./useAnalytics-2o7uH7x2.js";import"./useApp-CBwGPM4M.js";const c=m(e=>({links:{margin:e.spacing(2,0),display:"grid",gridAutoFlow:"column",gridAutoColumns:"min-content",gridGap:e.spacing(3),wordBreak:"keep-all"}}),{name:"BackstageHeaderIconLinkRow"});function n(e){const{links:o}=e,i=c();return a.jsx("nav",{className:i.links,children:o.map((l,s)=>a.jsx(t,{...l},s+1))})}n.__docgenInfo={description:`HTML nav tag with links mapped inside

@public`,methods:[],displayName:"HeaderIconLinkRow",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
}`,signature:{properties:[{key:"color",value:{name:"union",raw:"'primary' | 'secondary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"}],required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"href",value:{name:"string",required:!1}},{key:"icon",value:{name:"ReactNode",required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"MouseEventHandler",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEventHandler<HTMLAnchorElement>",required:!1}},{key:"title",value:{name:"string",required:!1}}]}}],raw:"IconLinkVerticalProps[]"},description:""}}};const w={title:"Data Display/HeaderIconLinkRow",component:n,tags:["!manifest"]},r=e=>a.jsx(n,{...e});r.args={links:[{color:"primary",disabled:!1,href:"https://google.com",label:"primary",title:"title"},{color:"secondary",disabled:!1,href:"https://google.com",label:"secondary",title:"title-2"}]};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
}`,signature:{properties:[{key:"color",value:{name:"union",raw:"'primary' | 'secondary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"}],required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"href",value:{name:"string",required:!1}},{key:"icon",value:{name:"ReactNode",required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"MouseEventHandler",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEventHandler<HTMLAnchorElement>",required:!1}},{key:"title",value:{name:"string",required:!1}}]}}],raw:"IconLinkVerticalProps[]"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: Props) => <HeaderIconLinkRow {...args} />",...r.parameters?.docs?.source}}};const q=["Default"];export{r as Default,q as __namedExportsOrder,w as default};
