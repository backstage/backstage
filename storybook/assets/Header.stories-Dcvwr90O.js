import{bQ as e}from"./iframe-Di5Wv8w_.js";import{H as o}from"./Header-yulzWIcb.js";import{P as p}from"./Page-CZ4TFezB.js";import{H as r}from"./HeaderLabel-n7oqMnHf.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-RlKHW0vA.js";import"./Box-6skH1RcB.js";import"./styled-BQfLikGu.js";import"./Grid-D2BXyWtR.js";import"./makeStyles-D-4gmWAY.js";import"./Breadcrumbs-CpzdOEIR.js";import"./index-B9sM2jn7.js";import"./Popover-DKXKr9Kk.js";import"./Modal-B97Kk5qL.js";import"./Portal-Chr9DQbW.js";import"./List-DO8RbCmD.js";import"./ListContext-B1eYXRXz.js";import"./ListItem-Ct7mIZpE.js";import"./Link-C0kM2CWc.js";import"./index-BE_MD4Ey.js";import"./lodash-DWZxpKTZ.js";import"./useAnalytics-B3tqbWl4.js";import"./useApp-WmaZUnnG.js";import"./Page-CNxlg7sH.js";import"./useMediaQuery-oRuCU2DB.js";import"./Tooltip-DBEUZ3lb.js";import"./Popper-DhoDdGhd.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,Q as default};
