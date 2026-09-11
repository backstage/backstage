import{bQ as e}from"./iframe-CJeP2vvm.js";import{H as o}from"./Header-ChG2lwcV.js";import{P as p}from"./Page-CS5BOfxv.js";import{H as r}from"./HeaderLabel-CXAk5PGB.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BQ6fIoUn.js";import"./Box-EvvPk6ng.js";import"./styled-CFBPwnSz.js";import"./Grid-udHwzQNb.js";import"./makeStyles-CtzsXOCL.js";import"./Breadcrumbs-BmKdWo8H.js";import"./index-B9sM2jn7.js";import"./Popover-CvtB33aW.js";import"./Modal-Cbc0lDQs.js";import"./Portal-BUIyCVuS.js";import"./List-CzxNgMf8.js";import"./ListContext-CAbC7OWa.js";import"./ListItem-Dr_x9euU.js";import"./Link--Fc6A4Yf.js";import"./index-BPSuVA-o.js";import"./lodash-LkEJAKVD.js";import"./useAnalytics-De2cbPtm.js";import"./useApp-CK6pVRGl.js";import"./Page-C-M_ZHgG.js";import"./useMediaQuery-DBqJ7F7B.js";import"./Tooltip-G7GlOMSB.js";import"./Popper-BsQD34Hv.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
