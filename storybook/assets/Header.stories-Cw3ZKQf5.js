import{j as e}from"./iframe-D7zjeBit.js";import{H as o}from"./Header-L79glJ9f.js";import{P as p}from"./Page-CcBrvD7W.js";import{H as r}from"./HeaderLabel-DvoUnGIw.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CwZMGvXr.js";import"./Box-eqPq7tDA.js";import"./styled-Cto7NXi2.js";import"./Grid-BwBMybgh.js";import"./makeStyles-BdLugvEp.js";import"./Breadcrumbs-iK3eEwKd.js";import"./index-B9sM2jn7.js";import"./Popover-BLVU7E1s.js";import"./Modal-CKF7dnop.js";import"./Portal-B4c0pg-w.js";import"./List-_IcS7A5z.js";import"./ListContext-338I8pjt.js";import"./ListItem-PR8H70fv.js";import"./Link-43gYvX88.js";import"./index-B9TfV-iv.js";import"./lodash-CaiQO1ZN.js";import"./useAnalytics-CJoDpLKX.js";import"./useApp-CAJtRMT4.js";import"./Page-n6e5XJVR.js";import"./useMediaQuery-C_vpzr4_.js";import"./Tooltip-uVb4gd3h.js";import"./Popper-CEBtOcEQ.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
