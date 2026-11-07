import{j as e}from"./iframe-DXL2wfUr.js";import{H as o}from"./Header-C0hMvCut.js";import{P as p}from"./Page-rYLmmc3A.js";import{H as r}from"./HeaderLabel-BmgjO1HA.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BrE8P52p.js";import"./Box-Brmk0yUT.js";import"./styled-CPtkZ7WM.js";import"./Grid-BXM3QonJ.js";import"./makeStyles-dq_iUTd0.js";import"./Breadcrumbs-9vvfkdPg.js";import"./index-B9sM2jn7.js";import"./Popover-BkzeoTeD.js";import"./Modal-BGYUFiME.js";import"./Portal-C9dQ8bPJ.js";import"./List-CTh3iRsj.js";import"./ListContext-D7tGghNq.js";import"./ListItem-p8V-eNdP.js";import"./Link-B77ip_ac.js";import"./index-C-0D0ERV.js";import"./lodash-Dl1dFqKb.js";import"./useAnalytics-BPKTxT6C.js";import"./useApp-B5hGsOxI.js";import"./Page-llFv-217.js";import"./useMediaQuery-Dh-sWgI0.js";import"./Tooltip-Cm_0WizR.js";import"./Popper-CA5wwMZ8.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
