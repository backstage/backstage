import{j as e}from"./iframe-izSSIzTR.js";import{H as o}from"./Header-DyYMMrTd.js";import{P as p}from"./Page-DNCwUEcW.js";import{H as r}from"./HeaderLabel-BFfMhhCH.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Bi3ACGo1.js";import"./Box-BA3YWuLj.js";import"./styled-DV0BGOgt.js";import"./Grid-DS_Ye4hI.js";import"./makeStyles-efJG6AvH.js";import"./Breadcrumbs-ht_w-_6n.js";import"./index-B9sM2jn7.js";import"./Popover-DdhQCyLQ.js";import"./Modal-BbQmRZa1.js";import"./Portal-gwFfNa32.js";import"./List-Bk9wyVdJ.js";import"./ListContext-CKBIT16f.js";import"./ListItem-CLO1ybEL.js";import"./Link-2J958yax.js";import"./index-DfUIGjtL.js";import"./lodash-BqgGC0cZ.js";import"./useAnalytics-DIHZCFHN.js";import"./useApp-CAU_EJC9.js";import"./Page-D2h0DpVj.js";import"./useMediaQuery-BmcoM8-e.js";import"./Tooltip-BCaU-ke_.js";import"./Popper-BmNk75vF.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
