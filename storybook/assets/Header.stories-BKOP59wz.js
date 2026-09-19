import{j as e}from"./iframe-DIcQvc_4.js";import{H as o}from"./Header-BB6Qzyhv.js";import{P as p}from"./Page-BczWHXnh.js";import{H as r}from"./HeaderLabel-kyVBcRbA.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-jGhRI2xB.js";import"./Box-D_uAdcR5.js";import"./styled-CMENgzGI.js";import"./Grid-oLNTG-1m.js";import"./makeStyles-CSt6JC-p.js";import"./Breadcrumbs-DZW7ynYU.js";import"./index-B9sM2jn7.js";import"./Popover-DFw0ZfpA.js";import"./Modal-fK5idwhs.js";import"./Portal-DNVfUQPE.js";import"./List-Bi7BJlgZ.js";import"./ListContext-5lse5t1A.js";import"./ListItem-BlT-_Dx7.js";import"./Link-CNvpICkX.js";import"./index--onu0eIM.js";import"./lodash-D5XEdOes.js";import"./useAnalytics-CkzkVu-R.js";import"./useApp-CpeMA22u.js";import"./Page-B-fcxgXx.js";import"./useMediaQuery-Bvwydsmy.js";import"./Tooltip-DX18uned.js";import"./Popper-Bu6O3SHw.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
