import{j as e}from"./iframe-DVMaQ9oH.js";import{H as o}from"./Header-BsKDKxBj.js";import{P as p}from"./Page-PUeD2BPc.js";import{H as r}from"./HeaderLabel-StK7V6K-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BPhD8TYf.js";import"./Box-CFSsj6ua.js";import"./styled-BBv6xD1v.js";import"./Grid-BnNe0SDT.js";import"./Breadcrumbs-DnPEt-hB.js";import"./index-B9sM2jn7.js";import"./Popover-BAi_Nv0a.js";import"./Modal-CJ1fn4qg.js";import"./Portal-B9YgpH-D.js";import"./List-Dti-y3i6.js";import"./ListContext-BKfPcfO0.js";import"./ListItem-D0hmS8se.js";import"./Link-INNWSaUp.js";import"./lodash-Y_-RFQgK.js";import"./index-CrsCYslC.js";import"./useAnalytics-D_e6aR87.js";import"./useApp-CbdAPFaX.js";import"./Page-Bk3VKmh1.js";import"./useMediaQuery-BBjP_gp4.js";import"./Tooltip-DuScsKtZ.js";import"./Popper-D9ki8Cw9.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
