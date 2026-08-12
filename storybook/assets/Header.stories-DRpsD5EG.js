import{bR as e}from"./iframe-D690ZVKa.js";import{H as o}from"./Header-U7vhC_Zw.js";import{P as p}from"./Page-CIw5oLYW.js";import{H as r}from"./HeaderLabel-YatPeAjD.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-YzlsQ4pt.js";import"./Box-D2Fu4WUc.js";import"./styled-DacKj83C.js";import"./Grid-DmtR5II5.js";import"./makeStyles-CJxbGC76.js";import"./Breadcrumbs-RkA4ibjk.js";import"./index-B9sM2jn7.js";import"./Popover-BXeHjT9r.js";import"./Modal-DjTWj-MP.js";import"./Portal-B97G5yXy.js";import"./List-CzjBo6qt.js";import"./ListContext-Ckz_Cnm1.js";import"./ListItem-CPGGfXK8.js";import"./Link-DmZ9GlNp.js";import"./index-DrXFpTpJ.js";import"./lodash-CaHtv1AU.js";import"./useAnalytics-kpSi9Kln.js";import"./useApp-RZivroMa.js";import"./Page-BJnlExWP.js";import"./useMediaQuery-DWMpaXs6.js";import"./Tooltip-zde_bTyh.js";import"./Popper-gaqbHv12.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const {
    type
  } = args;
  return <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>;
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
