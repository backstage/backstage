import{j as e}from"./iframe-DGs96NRX.js";import{H as o}from"./Header-GKJWHZrZ.js";import{P as p}from"./Page-Calyy2Nd.js";import{H as r}from"./HeaderLabel-BIE-uHYl.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-1QbTQATo.js";import"./Box-D4WzEFhv.js";import"./styled-BpF5KOwn.js";import"./Grid-BHZNDkgf.js";import"./Breadcrumbs-B4h-tahO.js";import"./index-DnL3XN75.js";import"./Popover-Cyvu5YOR.js";import"./Modal-BddTY979.js";import"./Portal-d4IyiHDj.js";import"./List-6sBN0fEc.js";import"./ListContext-JUKi6eaD.js";import"./ListItem-B6WkBU7i.js";import"./Link-GHtCGRiO.js";import"./lodash-CwBbdt2Q.js";import"./index-Du2IYsJS.js";import"./useAnalytics-Dn6o1gMJ.js";import"./useApp-Sx5G5NdM.js";import"./Page-CkheYHtX.js";import"./useMediaQuery-DWWePGjr.js";import"./Tooltip-B0esBOhK.js";import"./Popper-O4AAWfmZ.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
