import{j as e}from"./iframe-CsCfxPn_.js";import{H as o}from"./Header-D2pjPmrD.js";import{P as p}from"./Page-DQPCvPDG.js";import{H as r}from"./HeaderLabel-BRDoZ5wY.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D_eIMjoi.js";import"./Box-B59PrcF8.js";import"./styled-BhaEuEq4.js";import"./Grid-BYa8idma.js";import"./makeStyles-Cyq7q47K.js";import"./Breadcrumbs-xR2tByOh.js";import"./index-B9sM2jn7.js";import"./Popover-B3s2h15z.js";import"./Modal-Bpr0arJu.js";import"./Portal-Mjfg2QfE.js";import"./List-BOkqMN_K.js";import"./ListContext-COVYUNkn.js";import"./ListItem-DLLda7RJ.js";import"./Link-BZkyGUYJ.js";import"./index-BnA6fLC5.js";import"./lodash-CbHAjvV7.js";import"./useAnalytics-w4gYjMWf.js";import"./useApp-C_ncuDBH.js";import"./Page-DGhx1dmv.js";import"./useMediaQuery-DzU9nR6M.js";import"./Tooltip-DGsNX3s4.js";import"./Popper-CCu5RvlF.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
