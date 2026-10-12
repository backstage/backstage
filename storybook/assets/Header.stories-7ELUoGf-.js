import{j as e}from"./iframe-5xJVwFMl.js";import{H as o}from"./Header-BwHp9uZa.js";import{P as p}from"./Page-BwvhPqx1.js";import{H as r}from"./HeaderLabel-D0uZy6qN.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CcmUjTPK.js";import"./Box-qXNKoQfM.js";import"./styled-DY-6LqDt.js";import"./Grid-BGkHqCZb.js";import"./makeStyles-C6RKmEA9.js";import"./Breadcrumbs-CpYhH6CM.js";import"./index-B9sM2jn7.js";import"./Popover-LaT7Yo7W.js";import"./Modal-BrzCxuMo.js";import"./Portal-zTU6I_cI.js";import"./List-DbnZjmoN.js";import"./ListContext-0INxBid3.js";import"./ListItem-RgFWmdu3.js";import"./Link-nmwsyCsZ.js";import"./index-Czerfnq4.js";import"./lodash-D_xO2xdO.js";import"./useAnalytics-wJCsvL7f.js";import"./useApp-CVTpPQ-8.js";import"./Page-D_XycK2b.js";import"./useMediaQuery-sauso4J3.js";import"./Tooltip-KYdABzey.js";import"./Popper-DJbmaxdA.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
