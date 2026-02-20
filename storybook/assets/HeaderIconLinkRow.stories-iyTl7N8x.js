import{j as n}from"./iframe-CXVefQjv.js";import{I as i}from"./IconLinkVertical-Cwg2KUCN.js";import{m as c}from"./makeStyles-cSB5pDml.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CROf0-mb.js";import"./Box-D7AnzI4p.js";import"./styled-B7NpzSmh.js";import"./Link-R8tlL6vJ.js";import"./lodash-DZtYjLW6.js";import"./index-B97xvfin.js";import"./useAnalytics-Bx4_U39Z.js";import"./useApp-DMj12Ulj.js";const m=c(r=>({links:{margin:r.spacing(2,0),display:"grid",gridAutoFlow:"column",gridAutoColumns:"min-content",gridGap:r.spacing(3),wordBreak:"keep-all"}}),{name:"BackstageHeaderIconLinkRow"});function a(r){const{links:o}=r,l=m();return n.jsx("nav",{className:l.links,children:o.map((s,t)=>n.jsx(i,{...s},t+1))})}a.__docgenInfo={description:`HTML nav tag with links mapped inside

@public`,methods:[],displayName:"HeaderIconLinkRow",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
}`,signature:{properties:[{key:"color",value:{name:"union",raw:"'primary' | 'secondary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"}],required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"href",value:{name:"string",required:!1}},{key:"icon",value:{name:"ReactNode",required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"MouseEventHandler",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEventHandler<HTMLAnchorElement>",required:!1}},{key:"title",value:{name:"string",required:!1}}]}}],raw:"IconLinkVerticalProps[]"},description:""}}};const L={title:"Data Display/HeaderIconLinkRow",component:a,tags:["!manifest"]},e=r=>n.jsx(a,{...r});e.args={links:[{color:"primary",disabled:!1,href:"https://google.com",label:"primary",title:"title"},{color:"secondary",disabled:!1,href:"https://google.com",label:"secondary",title:"title-2"}]};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
}`,signature:{properties:[{key:"color",value:{name:"union",raw:"'primary' | 'secondary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"}],required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"href",value:{name:"string",required:!1}},{key:"icon",value:{name:"ReactNode",required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"MouseEventHandler",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEventHandler<HTMLAnchorElement>",required:!1}},{key:"title",value:{name:"string",required:!1}}]}}],raw:"IconLinkVerticalProps[]"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
  <HeaderIconLinkRow
    links={[
      {
        color: "primary",
        disabled: false,
        href: "https://google.com",
        label: "primary",
        title: "title",
      },
      {
        color: "secondary",
        disabled: false,
        href: "https://google.com",
        label: "secondary",
        title: "title-2",
      },
    ]}
  />
);
`,...e.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: Props) => <HeaderIconLinkRow {...args} />",...e.parameters?.docs?.source}}};const q=["Default"];export{e as Default,q as __namedExportsOrder,L as default};
