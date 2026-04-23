import{j as e}from"./iframe-C8vBbMI-.js";import{H as o}from"./Header-BBV4-hZO.js";import{P as p}from"./Page-i0qLMb5T.js";import{H as r}from"./HeaderLabel-BFm88Arc.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B6osci-V.js";import"./Box-DIT1JwxG.js";import"./styled-BcmF7aJU.js";import"./Grid-DduoCecT.js";import"./makeStyles-DEhzw0UI.js";import"./Breadcrumbs-B0CUqmEc.js";import"./index-B9sM2jn7.js";import"./Popover-CaOdYvW5.js";import"./Modal-DmcxaYfQ.js";import"./Portal-DsizZWpB.js";import"./List-B5861Df-.js";import"./ListContext-BiZJobBt.js";import"./ListItem-BfkYT0su.js";import"./Link-CaYIfEDR.js";import"./index-NluNtBNI.js";import"./lodash-BfwZDLak.js";import"./useAnalytics-DKfC2Yhe.js";import"./useApp-Cchg7qe1.js";import"./Page-DlWnHsYp.js";import"./useMediaQuery-BArYkJcY.js";import"./Tooltip-j_b-FrAj.js";import"./Popper-BLUE86cB.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
