import{j as e}from"./iframe-DDGN0cGv.js";import{H as o}from"./Header-D5uvpNui.js";import{P as p}from"./Page-yUyCZ3Oe.js";import{H as r}from"./HeaderLabel-CiftoEtv.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B1PfSIwb.js";import"./Box-Ddxf02Aa.js";import"./styled-BpU391Me.js";import"./Grid-D5cwdvdp.js";import"./Breadcrumbs-B7ajNWj-.js";import"./index-B9sM2jn7.js";import"./Popover-BIEPvO5s.js";import"./Modal-y_bxeVJ1.js";import"./Portal-BqHzn-UB.js";import"./List-B6XxVgNa.js";import"./ListContext-BfPeZX-c.js";import"./ListItem-B4p-bJZY.js";import"./Link-UwAe9NOh.js";import"./lodash-Y_-RFQgK.js";import"./index-DCDfH_Li.js";import"./useAnalytics-CyvQxdhU.js";import"./useApp-CWuHwuj4.js";import"./Page-CHZLbfvY.js";import"./useMediaQuery-B_lKUfT2.js";import"./Tooltip-DRtRsFO2.js";import"./Popper-LrvUQOcS.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
