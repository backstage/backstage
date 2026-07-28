import{bR as e}from"./iframe-X5mwL4tp.js";import{H as o}from"./Header-BuEPzI2B.js";import{P as p}from"./Page-CRn5ks_J.js";import{H as r}from"./HeaderLabel-M9riCCyy.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CAKZR62T.js";import"./Box-ClEyY_Z1.js";import"./styled-DVG5Lz2h.js";import"./Grid-DtctBXEt.js";import"./makeStyles-CTt1csqa.js";import"./Breadcrumbs-ByNKo6iJ.js";import"./index-B9sM2jn7.js";import"./Popover-BnhP6LQq.js";import"./Modal-CaLbxsUd.js";import"./Portal-ahRnC-zM.js";import"./List-BY4TlFRU.js";import"./ListContext-DWMy4CLq.js";import"./ListItem-DM3el4vg.js";import"./Link-Bmr8Hz-w.js";import"./index-C5TKpozf.js";import"./lodash-DbDoiTXZ.js";import"./useAnalytics-M9bf2v34.js";import"./useApp-B4BHpcqM.js";import"./Page-BBVJmR_0.js";import"./useMediaQuery-BhQ1nUXD.js";import"./Tooltip-B6q7639i.js";import"./Popper-v57gGt3n.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
