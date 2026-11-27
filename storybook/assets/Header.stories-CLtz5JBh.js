import{j as e}from"./iframe-BLrGTSaW.js";import{H as o}from"./Header-G4LCdJAq.js";import{P as p}from"./Page-DaxKuM-U.js";import{H as r}from"./HeaderLabel-DNYW5dax.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BkqTlADW.js";import"./Box-Dre9Kf-d.js";import"./styled-C9flu1SF.js";import"./Grid-njQ-TjUb.js";import"./makeStyles-vgIFYWcM.js";import"./Breadcrumbs-DfTgophG.js";import"./index-B9sM2jn7.js";import"./Popover-DHzJRl_D.js";import"./Modal-0W9atvNy.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-CRz-FrZ-.js";import"./List-DXjprzcI.js";import"./ListContext-zWPrJgIH.js";import"./ListItem-CqPT8Adv.js";import"./Link-Lv4PpJLO.js";import"./index-Dp1J5c3v.js";import"./lodash-DzUEr9HT.js";import"./useApp-CYEN5pYN.js";import"./index-CAEKkElr.js";import"./useAnalytics-BEvcg19j.js";import"./Page-Do1JMLxH.js";import"./useMediaQuery-Cc5ArFdf.js";import"./Tooltip-BjJaBiZd.js";import"./Popper-C7OXpUH-.js";const k={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const z=["Default"];export{t as Default,z as __namedExportsOrder,k as default};
