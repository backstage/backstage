import{j as e}from"./iframe-CIT-dZu_.js";import{H as o}from"./Header-BKaxEZRr.js";import{P as p}from"./Page-DUiAmsMX.js";import{H as r}from"./HeaderLabel-6qoAPtgH.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C7pP-XTy.js";import"./Box-Cl1WRrl1.js";import"./styled-ezS9pEl7.js";import"./Grid-lcFrT8I1.js";import"./makeStyles-CS1pZXKe.js";import"./Breadcrumbs-Cu2x5N9z.js";import"./index-B9sM2jn7.js";import"./Popover-CdhPhseu.js";import"./Modal-Bt2cneYZ.js";import"./Portal-D0CrObPP.js";import"./List-DWlZD8z9.js";import"./ListContext-Ce2BqoB3.js";import"./ListItem-Dm8k4XZR.js";import"./Link-CpjWFI-c.js";import"./index-B-HyNN-b.js";import"./lodash-2vuPdsKC.js";import"./useApp-BxfNURiw.js";import"./index-bElBlM3z.js";import"./useAnalytics-DnCYApMA.js";import"./Page-DMwILoTu.js";import"./useMediaQuery-C4K3Pcrq.js";import"./Tooltip-Cnc5VKv3.js";import"./Popper-B-X6XUTm.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,S as default};
