import{bR as e}from"./iframe-COykYx45.js";import{H as o}from"./Header-DNfzv0HC.js";import{P as p}from"./Page-DVGecFSJ.js";import{H as r}from"./HeaderLabel-ChkMcsFi.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BiXSpkv2.js";import"./Box-BZMsMDiJ.js";import"./styled-CwK1uEmG.js";import"./Grid-BRcD6lxX.js";import"./makeStyles-4LVf8ZW1.js";import"./Breadcrumbs-BorxN1az.js";import"./index-B9sM2jn7.js";import"./Popover-L3wNebbE.js";import"./Modal-C80IvqPX.js";import"./Portal-DDnKiyvW.js";import"./List-D4wG1S98.js";import"./ListContext-CnRdieQg.js";import"./ListItem-MGSaNCae.js";import"./Link-Bm3AlTT9.js";import"./index-CS7sQkHC.js";import"./lodash-B-tmFX5K.js";import"./useAnalytics-D6lRulOX.js";import"./useApp-OLJN8mL2.js";import"./Page-CCxkrf0M.js";import"./useMediaQuery-DFeb_wXF.js";import"./Tooltip-BSFhZXa8.js";import"./Popper-CLueAnmZ.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
