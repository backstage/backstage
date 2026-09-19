import{j as e}from"./iframe-CxlUpTpq.js";import{H as o}from"./Header-DP8xwmRP.js";import{P as p}from"./Page-BMk_e0AB.js";import{H as r}from"./HeaderLabel-DcQqBoQH.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-6IPjvxAH.js";import"./Box-BmCEZaGT.js";import"./styled-ri-sX4kt.js";import"./Grid-BLfllSxx.js";import"./makeStyles-DbA2ZWGd.js";import"./Breadcrumbs-DRRf9GFu.js";import"./index-B9sM2jn7.js";import"./Popover-BYsAO0mz.js";import"./Modal-quoFuAtb.js";import"./Portal-DIfaqq2w.js";import"./List-DdEJ-kwg.js";import"./ListContext-T4foTbcb.js";import"./ListItem-CFzuWqPn.js";import"./Link-bOvDEdKZ.js";import"./index-22DygKJ2.js";import"./lodash-7klT_A_g.js";import"./useAnalytics-CsE2FyHM.js";import"./useApp-xRl_5Yzb.js";import"./Page-BZIO46U_.js";import"./useMediaQuery-BRiIg9w2.js";import"./Tooltip-Ck3d58SL.js";import"./Popper-BQ9oVfPx.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
