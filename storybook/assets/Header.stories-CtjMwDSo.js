import{j as e}from"./iframe-D9zyyCLm.js";import{H as o}from"./Header-B0_NKmUg.js";import{P as p}from"./Page-D5Tv3DGZ.js";import{H as r}from"./HeaderLabel-ZdmU-Z7d.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CBlb2sGb.js";import"./Box-Defj12pz.js";import"./styled-D79h_skJ.js";import"./Grid-BB8AJhQB.js";import"./makeStyles-CWCwef5R.js";import"./Breadcrumbs-uZHFvEmJ.js";import"./index-B9sM2jn7.js";import"./Popover-4cdXxDWz.js";import"./Modal-BrBYhxf7.js";import"./Portal-BgM3-FYw.js";import"./List-C4uiJVgu.js";import"./ListContext-BGhsm4dp.js";import"./ListItem-O17-VUI5.js";import"./Link-BQ85eo89.js";import"./index-CZyC9z6L.js";import"./lodash-c_X8lcuE.js";import"./useAnalytics-b9lD6bMf.js";import"./useApp-D2m-Ae2p.js";import"./Page-BeNEh3X7.js";import"./useMediaQuery-RUGQamlk.js";import"./Tooltip-HeeyuNqA.js";import"./Popper-BVc_xbFX.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
