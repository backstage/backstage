import{j as n}from"./iframe-CSFr66Yj.js";import{I as i}from"./IconLinkVertical-BLEQOA6I.js";import{m as c}from"./makeStyles-uVnrWAVB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BbjHc-mo.js";import"./Box-Cb3Gr3iO.js";import"./styled-CmsioGDa.js";import"./Link-BuppC-Xy.js";import"./lodash-DoZXRjYt.js";import"./index-CWVjNXJ7.js";import"./useAnalytics-iKBzR4vv.js";import"./useApp-9WiUV6Eb.js";const m=c(r=>({links:{margin:r.spacing(2,0),display:"grid",gridAutoFlow:"column",gridAutoColumns:"min-content",gridGap:r.spacing(3),wordBreak:"keep-all"}}),{name:"BackstageHeaderIconLinkRow"});function a(r){const{links:o}=r,l=m();return n.jsx("nav",{className:l.links,children:o.map((s,t)=>n.jsx(i,{...s},t+1))})}a.__docgenInfo={description:`HTML nav tag with links mapped inside

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
