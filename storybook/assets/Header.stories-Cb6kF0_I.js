import{bR as e}from"./iframe-CMKJKLUT.js";import{H as o}from"./Header-BvQeBbei.js";import{P as p}from"./Page-DDk9zv1u.js";import{H as r}from"./HeaderLabel-BYgQz6p5.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DooOz5zf.js";import"./Box-CcFL9itu.js";import"./styled-DkbS0659.js";import"./Grid-UmxeFSJB.js";import"./makeStyles-CXoO9pfI.js";import"./Breadcrumbs-D0jXOiks.js";import"./index-B9sM2jn7.js";import"./Popover-R_8ybVQZ.js";import"./Modal-DxIGJueK.js";import"./Portal-C_-ZAH0t.js";import"./List-Dqpl4jxs.js";import"./ListContext-CStQo49q.js";import"./ListItem--taqkzDX.js";import"./Link-C7EGKb3p.js";import"./index-C_93cPm_.js";import"./lodash-BVa2wb4L.js";import"./useAnalytics-CnatrMx6.js";import"./useApp-jTIyofwr.js";import"./Page-C4OWD1XI.js";import"./useMediaQuery-Ce5CPtgY.js";import"./Tooltip-Cco8s-30.js";import"./Popper-B0SQBiNE.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
