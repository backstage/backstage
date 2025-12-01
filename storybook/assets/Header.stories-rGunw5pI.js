import{j as e}from"./iframe-B07WZXM3.js";import{H as o}from"./Header-DiVYYXnp.js";import{P as p}from"./Page-CJhXbKJS.js";import{H as r}from"./HeaderLabel-BStuk-9k.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-C7gnyS-b.js";import"./Box-BLhfQJZZ.js";import"./styled-DWF50Q3F.js";import"./Grid-BY5Lob_Q.js";import"./Breadcrumbs-DD5WjFyL.js";import"./index-DnL3XN75.js";import"./Popover-BvP6HXT7.js";import"./Modal-C4lsEVR2.js";import"./Portal-XA5rRvQB.js";import"./List-NEqxYc-i.js";import"./ListContext-DoxtYS94.js";import"./ListItem-CbK_QR24.js";import"./Link-BSdi_-Cv.js";import"./lodash-CwBbdt2Q.js";import"./index-BxkUEN8z.js";import"./useAnalytics-CVMEzOss.js";import"./useApp-K3As38vi.js";import"./Page-CoVW7z3p.js";import"./useMediaQuery-CgXNwOmD.js";import"./Tooltip-CZw4hPcl.js";import"./Popper-DRLEgsx8.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
