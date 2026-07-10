import{bR as e}from"./iframe-B-XWDeDQ.js";import{H as o}from"./Header-Wd3nLLbk.js";import{P as p}from"./Page-DK2mtpYn.js";import{H as r}from"./HeaderLabel-D7NAtbJO.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-13dPsULL.js";import"./Box-B2gdNV-U.js";import"./styled-BkxpGzDj.js";import"./Grid-DlZWfQ-Q.js";import"./makeStyles-B-ovMmn3.js";import"./Breadcrumbs-DDhPRqZZ.js";import"./index-B9sM2jn7.js";import"./Popover-DE13dRQu.js";import"./Modal-BCq9dJdg.js";import"./Portal-DuyBAQfY.js";import"./List-B2qp51Az.js";import"./ListContext-FIADtkdO.js";import"./ListItem-DoBNITuN.js";import"./Link-CSdGXlEL.js";import"./index-BOP42mNO.js";import"./lodash-B6QrYLNa.js";import"./useAnalytics-DVZxQzXL.js";import"./useApp-DQh8lVpI.js";import"./Page-CGwfGCLt.js";import"./useMediaQuery-C1kxfTQZ.js";import"./Tooltip-D0BBNodq.js";import"./Popper-BLBwQ0E1.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
