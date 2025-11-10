import{j as e}from"./iframe-Dg7jNfgV.js";import{H as o}from"./Header-BdGAEMO4.js";import{P as p}from"./Page-A9_jgtKR.js";import{H as r}from"./HeaderLabel-eG2M5jzr.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-BcSQLsNg.js";import"./Box-Bmqbh7u4.js";import"./styled-CMe42Sps.js";import"./Grid-DZoxUphm.js";import"./Breadcrumbs-CbDbqLYV.js";import"./index-DnL3XN75.js";import"./Popover-BRFYuyYy.js";import"./Modal-CaeBjbT7.js";import"./Portal-DaCRxhVb.js";import"./List-CB5Cl-bM.js";import"./ListContext-DjmviigF.js";import"./ListItem-WexTgdCu.js";import"./Link-gNdToM-H.js";import"./lodash-CwBbdt2Q.js";import"./index-DJhhhiwK.js";import"./useAnalytics-DDAI3Sby.js";import"./useApp-DBejBM5d.js";import"./Page-CjhVM5cD.js";import"./useMediaQuery-DpVjFp9_.js";import"./Tooltip-hjut9A6-.js";import"./Popper-DfjHoTPM.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
