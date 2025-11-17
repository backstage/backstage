import{j as e}from"./iframe-CIM5duhm.js";import{H as o}from"./Header-D2I9quOv.js";import{P as p}from"./Page-Dn6BE-oL.js";import{H as r}from"./HeaderLabel-BqiCCwgP.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-BqBBnQbG.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./Grid-Duc3jmgA.js";import"./Breadcrumbs-QhhMBWQ2.js";import"./index-DnL3XN75.js";import"./Popover-B59RL4fp.js";import"./Modal-CTawIxqI.js";import"./Portal-6z5sMs7a.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./ListItem-C8QkAD_t.js";import"./Link-DCWBCw0R.js";import"./lodash-CwBbdt2Q.js";import"./index-eXSQF74E.js";import"./useAnalytics-BRyHidSV.js";import"./useApp-DECMHJKF.js";import"./Page-CnqwYXFK.js";import"./useMediaQuery-Ed1BqGn2.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
