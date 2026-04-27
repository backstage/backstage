import{j as e}from"./iframe-UdCk74ed.js";import{H as o}from"./Header-_Rkm1XL7.js";import{P as p}from"./Page-Cq3qPRGA.js";import{H as r}from"./HeaderLabel-BatBQWTk.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D3i7jAAW.js";import"./Box-sbiym-y5.js";import"./styled-BN87Jrul.js";import"./Grid-DwqHvQ9E.js";import"./makeStyles-EOk-SryI.js";import"./Breadcrumbs-RUlhUQ00.js";import"./index-B9sM2jn7.js";import"./Popover-CKDAusRL.js";import"./Modal-88nru509.js";import"./Portal-B_bZnr3n.js";import"./List-CFWP97D4.js";import"./ListContext-C8Zyt_3h.js";import"./ListItem-D0ITxQe3.js";import"./Link-DW5yfdOI.js";import"./index-BZAuc_Yo.js";import"./lodash-BPf5Z96Y.js";import"./useAnalytics-DsUIDtns.js";import"./useApp-CPPq470-.js";import"./Page-ClkNySDd.js";import"./useMediaQuery-ItKfx-g2.js";import"./Tooltip-BMMZ8usS.js";import"./Popper-Ds0Kdlca.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
