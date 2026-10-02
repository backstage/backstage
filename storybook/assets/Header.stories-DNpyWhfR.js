import{j as e}from"./iframe-DOtOeTqo.js";import{H as o}from"./Header-if-bKatC.js";import{P as p}from"./Page-JJ2QXB8Z.js";import{H as r}from"./HeaderLabel-WfyXil0N.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cd5k3AZg.js";import"./Box-D0ehxfuJ.js";import"./styled-CZEjihDZ.js";import"./Grid-KxYFYxAG.js";import"./makeStyles-aCtRezqa.js";import"./Breadcrumbs-BOaSG6IY.js";import"./index-B9sM2jn7.js";import"./Popover-DuOXUFds.js";import"./Modal-SqFFY23X.js";import"./Portal-qDuBfE_Q.js";import"./List-IyXwRYVt.js";import"./ListContext-qvPrRuDM.js";import"./ListItem-BmxIywAG.js";import"./Link-D1jM9Lpj.js";import"./index-7nocqFCe.js";import"./lodash-C_cdduUD.js";import"./useAnalytics-DanEeCEV.js";import"./useApp-CYz1MO9C.js";import"./Page-Co5vglja.js";import"./useMediaQuery-CChJnaOK.js";import"./Tooltip-eAJtBP-m.js";import"./Popper-YuZuwxVq.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
