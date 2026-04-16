import{j as e}from"./iframe-B7ESvRaB.js";import{H as o}from"./Header-CXqHySEH.js";import{P as p}from"./Page-DjwVjj8v.js";import{H as r}from"./HeaderLabel-Cv5vp_mE.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CkFMst7q.js";import"./Box-BGVcxrSI.js";import"./styled-BYmoTReO.js";import"./Grid-DUZSx2Cf.js";import"./makeStyles-D6c8jQg1.js";import"./Breadcrumbs-DVHN3Cpu.js";import"./index-B9sM2jn7.js";import"./Popover-B6eOqlBd.js";import"./Modal-ChytUIep.js";import"./Portal-Dv8WnOrA.js";import"./List-BzC9H2Gx.js";import"./ListContext-Cg-0b41u.js";import"./ListItem-D3zRoU3Q.js";import"./Link-BVbc5K8M.js";import"./index-DWyhtxdM.js";import"./lodash-Bt12QuHv.js";import"./useAnalytics-DL1ROu7Z.js";import"./useApp--u6yStsZ.js";import"./Page-D0vuqOxv.js";import"./useMediaQuery-CTo7lni9.js";import"./Tooltip-DDcr_SxO.js";import"./Popper-B4XOTFHE.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
