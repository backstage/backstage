import{bR as e}from"./iframe-DHsLdmE0.js";import{H as o}from"./Header-Dv4BDQjT.js";import{P as p}from"./Page-COIHpNSq.js";import{H as r}from"./HeaderLabel-Dwb1x1MU.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C_caHQS7.js";import"./Box-ynx69IFE.js";import"./styled-CT8k9EBB.js";import"./Grid-DxJtb9e-.js";import"./makeStyles-Dzpfwqkv.js";import"./Breadcrumbs-BhcfUwu1.js";import"./index-B9sM2jn7.js";import"./Popover-PivTigYr.js";import"./Modal-D__7YiCg.js";import"./Portal-DByf1mCb.js";import"./List-DBJidFSb.js";import"./ListContext-Hnsssjg3.js";import"./ListItem-DFCYyHsM.js";import"./Link-KwMtLRIs.js";import"./index-BNHqqOoN.js";import"./lodash-C10OX6Vn.js";import"./useAnalytics-D5-Jfhzg.js";import"./useApp-CQ9I6Gkh.js";import"./Page-C_P_C4nB.js";import"./useMediaQuery-CI5gl9tu.js";import"./Tooltip-enjgkI7H.js";import"./Popper-C2XBrDYl.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
