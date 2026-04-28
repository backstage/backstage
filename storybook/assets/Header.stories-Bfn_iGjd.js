import{j as e}from"./iframe-Tg-tOL7r.js";import{H as o}from"./Header-BM35x_OP.js";import{P as p}from"./Page-B-1sWiXG.js";import{H as r}from"./HeaderLabel-DprXmxzT.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-V8YwbHlM.js";import"./Box-OYxHzwcw.js";import"./styled-vStV8VkZ.js";import"./Grid-CWzrm0bY.js";import"./makeStyles-BHicTeCr.js";import"./Breadcrumbs-BYVys9Eg.js";import"./index-B9sM2jn7.js";import"./Popover-DXjczkYd.js";import"./Modal-C3ehDU_j.js";import"./Portal-D1OaIdE9.js";import"./List-Bn-Heble.js";import"./ListContext-Bmt6Pt9F.js";import"./ListItem-BxOtbo8f.js";import"./Link-Cr3hmmz_.js";import"./index-bEg_r36Z.js";import"./lodash-BweN80hA.js";import"./useAnalytics-DVZEM2og.js";import"./useApp-DATYOo-f.js";import"./Page-DexsQoU6.js";import"./useMediaQuery-B74gwjlt.js";import"./Tooltip-YEgNEbvL.js";import"./Popper-Bs4wNPYC.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
