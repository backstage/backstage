import{j as e}from"./iframe-SO2aIStn.js";import{H as o}from"./Header-gE2mSYyL.js";import{P as p}from"./Page-D3iyWUDn.js";import{H as r}from"./HeaderLabel-Bf_n3-5P.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-4Qfn4Dwd.js";import"./Box-DWYmvqFk.js";import"./styled-AHWGCPSK.js";import"./Grid-DyKyVuYQ.js";import"./makeStyles-DqgeW26M.js";import"./Breadcrumbs-DL0x2zFp.js";import"./index-B9sM2jn7.js";import"./Popover-DfZz5ASy.js";import"./Modal-BWwZygZu.js";import"./Portal-Bx0Zszvf.js";import"./List-OkrJGNXg.js";import"./ListContext-C8Vr105q.js";import"./ListItem-Bat2RRg4.js";import"./Link-sQvaDLc-.js";import"./index-DPwzdWYf.js";import"./lodash-DNFIy4FG.js";import"./useApp-BZeBLv5x.js";import"./index-B44vhErU.js";import"./useAnalytics-Dglv9EKv.js";import"./Page-Lxo0qIDT.js";import"./useMediaQuery-BnTTvYu_.js";import"./Tooltip-p1luAgoU.js";import"./Popper-V3_s0jIn.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,S as default};
