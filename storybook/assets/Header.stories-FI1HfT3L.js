import{j as e}from"./iframe-BOELprFv.js";import{H as o}from"./Header-Dm_8xi8V.js";import{P as p}from"./Page-DfJ8MsZf.js";import{H as r}from"./HeaderLabel-BfJk9c21.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CGZHUEKy.js";import"./Box-DfaVDnxz.js";import"./styled-B9TjYplk.js";import"./Grid-CH5PqTNF.js";import"./makeStyles-CSWS6G8b.js";import"./Breadcrumbs-Dd_dSvAx.js";import"./index-B9sM2jn7.js";import"./Popover-Cr3nyACi.js";import"./Modal-BJvjIkRj.js";import"./Portal-DWJfagAU.js";import"./List-j_RiqkVh.js";import"./ListContext-IUdz5Dmy.js";import"./ListItem-ByTdyqTk.js";import"./Link-BwYnYGUx.js";import"./index-B4exrKOF.js";import"./lodash-DvkL6iKH.js";import"./useAnalytics-BJhOaRVB.js";import"./useApp-7Kwzc3rd.js";import"./Page-dlNZdOp0.js";import"./useMediaQuery-LRUpMN7w.js";import"./Tooltip-CNoLi4pN.js";import"./Popper-ehh25wyz.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
