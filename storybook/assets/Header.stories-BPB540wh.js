import{j as e}from"./iframe-C9zrakkc.js";import{H as o}from"./Header-B4YK7wc0.js";import{P as p}from"./Page-sRCQHiJB.js";import{H as r}from"./HeaderLabel-DIsNgQrz.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DwgoPk_d.js";import"./Box-C1t3nISm.js";import"./styled-q2Tapbp0.js";import"./Grid-JwSod7uj.js";import"./Breadcrumbs-foI2WanG.js";import"./index-B9sM2jn7.js";import"./Popover-DNks6xHK.js";import"./Modal-BI7VDIZ7.js";import"./Portal-CYobuNZx.js";import"./List-Dykhft8E.js";import"./ListContext-D4YzdYeM.js";import"./ListItem-DN7mBFNT.js";import"./Link-C1eBfv8e.js";import"./lodash-Y_-RFQgK.js";import"./index-kZEKiPjo.js";import"./useAnalytics-DAZilNqi.js";import"./useApp-5u7uhQnf.js";import"./Page-xg1vkiyR.js";import"./useMediaQuery-BK3120Kc.js";import"./Tooltip-CwwM6KlC.js";import"./Popper-CnoPmosF.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
