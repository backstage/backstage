import{j as e}from"./iframe-CixUC8j1.js";import{H as o}from"./Header-Bi4QhIjO.js";import{P as p}from"./Page-DYdzHE2k.js";import{H as r}from"./HeaderLabel-CnQhR7xD.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-c6WVHYgY.js";import"./Box-D1RsNjpj.js";import"./styled-CqIv_so7.js";import"./Grid-CcKL163D.js";import"./makeStyles-Cp3IDLB-.js";import"./Breadcrumbs-BDT8niN8.js";import"./index-B9sM2jn7.js";import"./Popover-CQuV6yxh.js";import"./Modal-BI26UG6D.js";import"./Portal-BroLl6Ko.js";import"./List-DhQPLXmh.js";import"./ListContext-Cbu1p0g4.js";import"./ListItem-DErUsc_W.js";import"./Link-DUMwxCe0.js";import"./index-D8S5QgdP.js";import"./lodash-NKDvZXjW.js";import"./useAnalytics-BNURDc1p.js";import"./useApp-CjKAgEMO.js";import"./Page-CvTIWEq9.js";import"./useMediaQuery-bkzg40Zf.js";import"./Tooltip-D5awj6H-.js";import"./Popper-B5Do-ers.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
