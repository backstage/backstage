import{bQ as e}from"./iframe-JPiukB_R.js";import{H as o}from"./Header-a_iL60Eo.js";import{P as p}from"./Page-BIOmgpdc.js";import{H as r}from"./HeaderLabel-Bqyb_J29.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-z69OeZWT.js";import"./Box-B2a9eHDH.js";import"./styled-DQnat59B.js";import"./Grid-CNTu3jbM.js";import"./makeStyles-CRHqG-EO.js";import"./Breadcrumbs-CUQv31VK.js";import"./index-B9sM2jn7.js";import"./Popover-DWcf8tVw.js";import"./Modal-BVaBLt3m.js";import"./Portal-Co95SX8y.js";import"./List-T_3_nzLY.js";import"./ListContext-DVVZhWT2.js";import"./ListItem-Bq2ZKbAR.js";import"./Link-C3f28ZV-.js";import"./index-D_sl5V-c.js";import"./lodash-6cxX-S9O.js";import"./useAnalytics-D8KrhC1p.js";import"./useApp-XQFXwPZE.js";import"./Page-Q7MUwmGf.js";import"./useMediaQuery-D73CdNvo.js";import"./Tooltip-BtSzS_xo.js";import"./Popper-fDV3enyA.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
