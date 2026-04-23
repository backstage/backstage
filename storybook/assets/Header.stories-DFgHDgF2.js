import{j as e}from"./iframe-D4ojcRBn.js";import{H as o}from"./Header-B-4I7xv4.js";import{P as p}from"./Page-BUEohvJu.js";import{H as r}from"./HeaderLabel-BAfwHxPb.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-fqZ92hBn.js";import"./Box-laszcGHL.js";import"./styled-DZLwQIlI.js";import"./Grid-DTyJ7xkb.js";import"./makeStyles-Cl-w1ABh.js";import"./Breadcrumbs-vjhpJKrK.js";import"./index-B9sM2jn7.js";import"./Popover-Br3Mvmbr.js";import"./Modal-DJW-GyYR.js";import"./Portal-CTav-3Kk.js";import"./List-F0S5B9Dv.js";import"./ListContext-S6LlGKy0.js";import"./ListItem-B4NcQ-mY.js";import"./Link-BY--rZrj.js";import"./index-DW-rjBCk.js";import"./lodash-B6rdiaVd.js";import"./useAnalytics-09trSmCC.js";import"./useApp-D8s9Wbol.js";import"./Page-6EbLHWl-.js";import"./useMediaQuery-Dvi-4iTW.js";import"./Tooltip-CrYI3p8-.js";import"./Popper-CS4j-s-3.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
