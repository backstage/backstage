import{j as e}from"./iframe-BkP0WlJq.js";import{H as o}from"./Header-DMlD387X.js";import{P as p}from"./Page-C_c-DKNg.js";import{H as r}from"./HeaderLabel-CnPtqRYR.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CsM-3NrU.js";import"./Box-CtyD_mKx.js";import"./styled-DkvpMltq.js";import"./Grid-CJH0jvjV.js";import"./makeStyles-x_iRcUX-.js";import"./Breadcrumbs-Da7rotpX.js";import"./index-B9sM2jn7.js";import"./Popover-CKUtrh1p.js";import"./Modal-B3xtW-GN.js";import"./Portal-DFAos_7D.js";import"./List-D9EXf02M.js";import"./ListContext-JoB9gWoY.js";import"./ListItem-Dhi0hwUe.js";import"./Link-BxRVLp8M.js";import"./index-ghTZu97H.js";import"./lodash-BwZXkg-A.js";import"./useAnalytics-C3NR7LVW.js";import"./useApp-BPVHau74.js";import"./Page-7VpCq1dW.js";import"./useMediaQuery-CShEnKh3.js";import"./Tooltip-B0A8oVTS.js";import"./Popper-AR2CJIOS.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
