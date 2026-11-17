import{j as e}from"./iframe-Czj8FpnD.js";import{H as o}from"./Header-CTqMvy8H.js";import{P as p}from"./Page-CCdZmb0n.js";import{H as r}from"./HeaderLabel-7UYPzaWx.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BVmqXxyf.js";import"./Box-CpxpfSAX.js";import"./styled-PK73AnSt.js";import"./Grid-DIMgJpwW.js";import"./makeStyles-CFi4fJAr.js";import"./Breadcrumbs-BsJ_-SRE.js";import"./index-B9sM2jn7.js";import"./Popover-CmWUUrYI.js";import"./Modal-Bq6PAgHC.js";import"./Portal-BgeFjtYt.js";import"./List-DZtaOPeh.js";import"./ListContext-DjY1Lg1l.js";import"./ListItem-CckUwNqO.js";import"./Link-n7xySPGa.js";import"./index-DU-eUBoq.js";import"./lodash-C1WtViFu.js";import"./useApp-CmVnEtRW.js";import"./index-BCJhT9-Z.js";import"./useAnalytics-yVJ1Dxzq.js";import"./Page-CHia4K7o.js";import"./useMediaQuery-C6u6_lDt.js";import"./Tooltip-Jv9c5kgc.js";import"./Popper-CWkh7WUp.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
