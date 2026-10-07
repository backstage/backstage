import{j as e}from"./iframe-piw0-GWS.js";import{H as o}from"./Header-Cy2D0KC4.js";import{P as p}from"./Page-aritep4E.js";import{H as r}from"./HeaderLabel-CxDq25pq.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CmT_wHNE.js";import"./Box-BadlU00i.js";import"./styled-EqtXE7BT.js";import"./Grid-Bua32Pkj.js";import"./makeStyles-DDl_fC1G.js";import"./Breadcrumbs-DbnWUhep.js";import"./index-B9sM2jn7.js";import"./Popover-D52B1VUZ.js";import"./Modal-DrU5ju0Q.js";import"./Portal-BFg9zE69.js";import"./List-waPtU691.js";import"./ListContext-CZXGcFTa.js";import"./ListItem-DDitZ_mI.js";import"./Link-9LmnYNwl.js";import"./index-CH0FH9SW.js";import"./lodash-Bzqu9al6.js";import"./useAnalytics-CWHO13NO.js";import"./useApp-Buw1Idw2.js";import"./Page-GTbdZvku.js";import"./useMediaQuery-C03K5vDw.js";import"./Tooltip-DIhCOuK4.js";import"./Popper-Cc43081h.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
