import{j as e}from"./iframe-K1-r__6v.js";import{H as o}from"./Header-Cpb9cqlJ.js";import{P as p}from"./Page-Bg956Yeg.js";import{H as r}from"./HeaderLabel-D9N6pN2E.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DV8CrkLx.js";import"./Box-B4QFyYd3.js";import"./styled-Dvtyklio.js";import"./Grid-ChuVeJzk.js";import"./makeStyles-cstAPlYX.js";import"./Breadcrumbs-jygY6msl.js";import"./index-B9sM2jn7.js";import"./Popover-BubBbulz.js";import"./Modal-B2FsjUJx.js";import"./Portal-sMTljpp0.js";import"./List-CB2UH9Sb.js";import"./ListContext-DOXF3fgH.js";import"./ListItem-B_ZN_8ak.js";import"./Link-B5LuFRSc.js";import"./index-DpBtBlP-.js";import"./lodash-DrAHxKI9.js";import"./useAnalytics-BPbkB55A.js";import"./useApp-qTVc4QMB.js";import"./Page-DpqqThCU.js";import"./useMediaQuery-wP2hHyDu.js";import"./Tooltip-DwW2_HQ0.js";import"./Popper-nGRjgLcs.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};
