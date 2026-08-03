import{bR as e}from"./iframe-Bep9_wBM.js";import{H as o}from"./Header-BtyHR2F0.js";import{P as p}from"./Page-Br1jEymh.js";import{H as r}from"./HeaderLabel-dbWiTQ77.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BFj2DLRh.js";import"./Box-CFxjkepC.js";import"./styled-BV5dnJ-_.js";import"./Grid-CSg20Lpu.js";import"./makeStyles-n7QD1cTQ.js";import"./Breadcrumbs-PuNCEAof.js";import"./index-B9sM2jn7.js";import"./Popover-BdF5uGXc.js";import"./Modal-sY10qo8j.js";import"./Portal-Crf4b_8F.js";import"./List-BDBMMAfU.js";import"./ListContext-B8pcQC18.js";import"./ListItem-BMjBWple.js";import"./Link-ltwtLIEX.js";import"./index-CEGXvcpa.js";import"./lodash-DlmSvGPN.js";import"./useAnalytics-BQV4eG0U.js";import"./useApp-DlngHpLU.js";import"./Page-DEFSJinZ.js";import"./useMediaQuery-CMVP-j8a.js";import"./Tooltip-Cr9D8Jdq.js";import"./Popper-BVu_p_NM.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
