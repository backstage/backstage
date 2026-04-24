import{j as e}from"./iframe-Dl5_TB80.js";import{H as o}from"./Header-Dss6iAOo.js";import{P as p}from"./Page-DEc13Mom.js";import{H as r}from"./HeaderLabel-CPP1xoFJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DGUjcNSz.js";import"./Box-OWTqpTcU.js";import"./styled-fbCpj-h3.js";import"./Grid-BMYKcvy9.js";import"./makeStyles-DVCr62xB.js";import"./Breadcrumbs-CU8LLFPC.js";import"./index-B9sM2jn7.js";import"./Popover-DeCGPguR.js";import"./Modal-B2_6DlPv.js";import"./Portal-BqMy1omF.js";import"./List-C3tE9H9r.js";import"./ListContext-CchtOyLx.js";import"./ListItem-BeH4jBX0.js";import"./Link-CT10y7Op.js";import"./index-DcwzAR-E.js";import"./lodash-CqCFQ6Ro.js";import"./useAnalytics-Co8FXgmH.js";import"./useApp-DpzLiM-Q.js";import"./Page-Uaow7Ble.js";import"./useMediaQuery-CgYtNtTv.js";import"./Tooltip-5QI_fZNO.js";import"./Popper-DQQ5NpOP.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
