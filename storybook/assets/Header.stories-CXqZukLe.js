import{j as e}from"./iframe-B3Qnvxa_.js";import{H as o}from"./Header-DIEjN7cP.js";import{P as p}from"./Page-pf7bcnl6.js";import{H as r}from"./HeaderLabel-BJ3FFGh1.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D_tR7I3M.js";import"./Box-PnVGeCt7.js";import"./styled-CANxBVf5.js";import"./Grid-TGje1sD4.js";import"./makeStyles-CKJzIE9W.js";import"./Breadcrumbs-CVqjvkWk.js";import"./index-B9sM2jn7.js";import"./Popover-DtBr8Z2o.js";import"./Modal-iftNTzzd.js";import"./Portal-D-iG_UKB.js";import"./List-BLwAGsov.js";import"./ListContext-CNPil1Lk.js";import"./ListItem-Ccoxgxd1.js";import"./Link-xSsqqjq2.js";import"./index-C3qdUgQ1.js";import"./lodash-BpdBJ3tT.js";import"./useAnalytics-9bqjDfWa.js";import"./useApp-D5j1Erf4.js";import"./Page-DoXwFG8k.js";import"./useMediaQuery-D1D7pFR4.js";import"./Tooltip-Cr1jpW-P.js";import"./Popper-J_gz1BcM.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
