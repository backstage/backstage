import{bQ as e}from"./iframe-BiC6vzfc.js";import{H as o}from"./Header-BQvmszlA.js";import{P as p}from"./Page-DSgy4OtC.js";import{H as r}from"./HeaderLabel-D0X7pedx.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D7MKAB87.js";import"./Box-CGVVs5_5.js";import"./styled-BNPRS9hw.js";import"./Grid-5kX5iYpE.js";import"./makeStyles-BTRKbQbn.js";import"./Breadcrumbs-CZmytByg.js";import"./index-B9sM2jn7.js";import"./Popover--bxAOOU_.js";import"./Modal-Bvhy2WXm.js";import"./Portal-BeSptJUc.js";import"./List-DJtEB1Fe.js";import"./ListContext-127C_KA8.js";import"./ListItem-Bm0RnmVU.js";import"./Link-BBWT3DGx.js";import"./index-HANU7tPZ.js";import"./lodash-CmicG8li.js";import"./useAnalytics-CWeTU5_6.js";import"./useApp-CsAmf1u2.js";import"./Page-CG-lHrdd.js";import"./useMediaQuery-DBpYJXMF.js";import"./Tooltip-B2T2MTsb.js";import"./Popper-CRE5HCjP.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
