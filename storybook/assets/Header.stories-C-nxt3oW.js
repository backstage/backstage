import{j as e}from"./iframe-DxHtOo4h.js";import{H as o}from"./Header-HDHmryFx.js";import{P as p}from"./Page-Dt2CHZjN.js";import{H as r}from"./HeaderLabel-H_Oq5Vpm.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-JFx6pSCA.js";import"./Box-D4AmoVSQ.js";import"./styled-MrIf0eXW.js";import"./Grid-BZqH7GD7.js";import"./makeStyles-B7nUh3vz.js";import"./Breadcrumbs-BndZT-S0.js";import"./index-B9sM2jn7.js";import"./Popover-C6WIDjGn.js";import"./Modal-BFkMhDw_.js";import"./Portal-CASUB1vb.js";import"./List-Ddwma2A2.js";import"./ListContext-DvRxGEhI.js";import"./ListItem-B7wjmJPK.js";import"./Link-Bm6GKZly.js";import"./index-CAPgTbWL.js";import"./lodash-B7zTZt0L.js";import"./useAnalytics-5JWmj_TX.js";import"./useApp-fIwTxcF-.js";import"./Page-DRlI0VE_.js";import"./useMediaQuery-DTL0IziD.js";import"./Tooltip-B2lQp7CI.js";import"./Popper-GKdSR7SA.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
