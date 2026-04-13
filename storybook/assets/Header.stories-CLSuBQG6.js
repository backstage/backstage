import{j as e}from"./iframe-v7Qh39PS.js";import{H as o}from"./Header-DGUjLVo4.js";import{P as p}from"./Page-BWlQgvVd.js";import{H as r}from"./HeaderLabel-DotqBz9N.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C386tFCH.js";import"./Box-DXZBhROx.js";import"./styled-BwMArDgT.js";import"./Grid-CVRWW0PN.js";import"./makeStyles-DymchkiN.js";import"./Breadcrumbs-BbOy9WMy.js";import"./index-B9sM2jn7.js";import"./Popover-BvLyvlr_.js";import"./Modal-CY2x_xo2.js";import"./Portal-GMu86kgZ.js";import"./List-xof-D_2B.js";import"./ListContext-DDzxA-kC.js";import"./ListItem-Dah0XUNP.js";import"./Link-C_cLMUQT.js";import"./index-B0lXpw7A.js";import"./lodash-Djj2Rbh9.js";import"./useAnalytics-C6qawMj-.js";import"./useApp-BPx4QKeD.js";import"./Page-BTSc7urH.js";import"./useMediaQuery-DosH5Bsg.js";import"./Tooltip-DfWrtCLA.js";import"./Popper-DLRR1cRg.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
