import{j as e}from"./iframe-CEdcshkh.js";import{H as o}from"./Header-D08Y-s7G.js";import{P as p}from"./Page-yhWZhIqf.js";import{H as r}from"./HeaderLabel-CV6Tx3aC.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cb6_VqAi.js";import"./Box-U2ogRZ16.js";import"./styled-BnWtJPbf.js";import"./Grid-Cg_-Bg10.js";import"./makeStyles-1bD4tTRg.js";import"./Breadcrumbs-B-wYGi4c.js";import"./index-B9sM2jn7.js";import"./Popover-QXKBM9-t.js";import"./Modal-DDX27gzZ.js";import"./Portal-mPuzIhmF.js";import"./List-Sn2FWo5J.js";import"./ListContext-DS5F4hFB.js";import"./ListItem-G31fJH_u.js";import"./Link-D32Zgqnn.js";import"./index-CITjFLh0.js";import"./lodash-DpFEZWQS.js";import"./useApp-Bnf2R7wN.js";import"./index-BMdILVLE.js";import"./useAnalytics-BKVYJGWd.js";import"./Page-lbASD3GK.js";import"./useMediaQuery-DafQNT2e.js";import"./Tooltip-BZZj5XLh.js";import"./Popper-BqP34tCO.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,S as default};
