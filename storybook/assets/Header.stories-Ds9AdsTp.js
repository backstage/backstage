import{bQ as e}from"./iframe-D3gHomOk.js";import{H as o}from"./Header-BvWlssPC.js";import{P as p}from"./Page-CCsebJTX.js";import{H as r}from"./HeaderLabel-CXmURq_a.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BmvYVgix.js";import"./Box-DrtPh2Ik.js";import"./styled-BVXiuVTX.js";import"./Grid-CyyBT709.js";import"./makeStyles-T-ZYABdB.js";import"./Breadcrumbs-DQt6BB1P.js";import"./index-B9sM2jn7.js";import"./Popover-BfJ-N3bb.js";import"./Modal-DqwrSVj2.js";import"./Portal-Cm7TvtLs.js";import"./List-CAlmE_09.js";import"./ListContext-CQj0z8nE.js";import"./ListItem-CqA_znyK.js";import"./Link-2oVCQXKr.js";import"./index-CP6cbUjo.js";import"./lodash-D6bxT6gM.js";import"./useAnalytics-l6aR9y4o.js";import"./useApp-MRQbwWB5.js";import"./Page-DscTDQBP.js";import"./useMediaQuery-BbHaSGmt.js";import"./Tooltip-pbQGjLjh.js";import"./Popper-BokpjFUP.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,Q as default};
