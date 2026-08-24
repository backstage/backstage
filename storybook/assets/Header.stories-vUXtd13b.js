import{bR as e}from"./iframe-BT856zKW.js";import{H as o}from"./Header-BBGUF--C.js";import{P as p}from"./Page-DLSeHtb0.js";import{H as r}from"./HeaderLabel-BlNjP4Q_.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-8P6TMzkn.js";import"./Box-DRDGYh8a.js";import"./styled-CRVzAmQX.js";import"./Grid-BxchgH-S.js";import"./makeStyles-BvvLmOsG.js";import"./Breadcrumbs-B_unzibD.js";import"./index-B9sM2jn7.js";import"./Popover-eB4PEisw.js";import"./Modal-QSs9r3fy.js";import"./Portal-DoFpeKrF.js";import"./List-IEeojV8D.js";import"./ListContext-SRmSumki.js";import"./ListItem-CB-Gvt6Y.js";import"./Link-R-hp-ZLy.js";import"./index-DQwWzZ9l.js";import"./lodash-BVPr3iau.js";import"./useAnalytics-DNoiAALH.js";import"./useApp-Cpkvybk9.js";import"./Page-DIc7xKzU.js";import"./useMediaQuery-qbcGLbDO.js";import"./Tooltip-BQY5eIJW.js";import"./Popper-BteZUn-1.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
