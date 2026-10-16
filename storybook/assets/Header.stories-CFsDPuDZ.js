import{j as e}from"./iframe-BYYe_BET.js";import{H as o}from"./Header-BunF10oW.js";import{P as p}from"./Page-B7boKf45.js";import{H as r}from"./HeaderLabel-Cw6uOwlj.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BDpU6DiZ.js";import"./Box-0Ecv0mGg.js";import"./styled-D32qgjdu.js";import"./Grid-DwakReSX.js";import"./makeStyles-BqAzHYwu.js";import"./Breadcrumbs-D8Ma0Bp1.js";import"./index-B9sM2jn7.js";import"./Popover-fyEVdibF.js";import"./Modal-CuU0PNJL.js";import"./Portal-BiZPg7Gu.js";import"./List-DdhsJ4F5.js";import"./ListContext-DCNSGU5g.js";import"./ListItem-t-HbrJXm.js";import"./Link-DQQIOfhH.js";import"./index-C_fPlOPu.js";import"./lodash-lhI2pBpB.js";import"./useAnalytics-DWxEYXCC.js";import"./useApp-C6DR3uil.js";import"./Page-yPHga3vG.js";import"./useMediaQuery-B7qojfqT.js";import"./Tooltip-DnttXpeA.js";import"./Popper-BgkeVSoU.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
