import{bQ as e}from"./iframe-DXdR4xPj.js";import{H as o}from"./Header-mGXXsiKZ.js";import{P as p}from"./Page-cvGJh9hr.js";import{H as r}from"./HeaderLabel-BY5w81ub.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-30DIbR1q.js";import"./Box-BJkHSLqZ.js";import"./styled-CiGmUP6u.js";import"./Grid-DrAuN9Lo.js";import"./makeStyles-BSWJde_H.js";import"./Breadcrumbs-CKg7CnI2.js";import"./index-B9sM2jn7.js";import"./Popover-Cnoxr92_.js";import"./Modal-0mYCwSY0.js";import"./Portal-BrV34s_5.js";import"./List-lTcp28bB.js";import"./ListContext-D9s9W3--.js";import"./ListItem-BOMvkCzo.js";import"./Link-CECNWZIJ.js";import"./index-CvcAu-rV.js";import"./lodash-CmjgS8yt.js";import"./useAnalytics-Bc97N_iw.js";import"./useApp-cePut29r.js";import"./Page-BdJTX54N.js";import"./useMediaQuery-BWokHd5O.js";import"./Tooltip-BlL23rdh.js";import"./Popper-CuTbSqkg.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,Q as default};
