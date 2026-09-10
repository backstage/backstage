import{bQ as e}from"./iframe-BjdV6pPy.js";import{H as o}from"./Header-Da1TqK1X.js";import{P as p}from"./Page-BRK_mGzv.js";import{H as r}from"./HeaderLabel-CgmmcVux.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-j3PRebtT.js";import"./Box-CGkRuXu1.js";import"./styled-CGu5BtQw.js";import"./Grid-ZTRqCXbs.js";import"./makeStyles-PWq3kkan.js";import"./Breadcrumbs-r2-ovr_5.js";import"./index-B9sM2jn7.js";import"./Popover-5tq32c0-.js";import"./Modal-CPVcYhee.js";import"./Portal-BIR3fdFj.js";import"./List-5AuHBILY.js";import"./ListContext-Cz3i0xyJ.js";import"./ListItem-CihulhwT.js";import"./Link-q9zDyQ1s.js";import"./index-DF9y2Kef.js";import"./lodash-Diin1sQj.js";import"./useAnalytics-BS2qsBtP.js";import"./useApp-BEYDC2Xe.js";import"./Page-Bqk5bsBc.js";import"./useMediaQuery-DxrCfJsR.js";import"./Tooltip-C9ZchjS5.js";import"./Popper-Ds34NmFE.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
