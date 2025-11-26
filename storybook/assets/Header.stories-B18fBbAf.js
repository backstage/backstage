import{j as e}from"./iframe-DXt6I_1q.js";import{H as o}from"./Header-DIyterII.js";import{P as p}from"./Page-wrNRljO-.js";import{H as r}from"./HeaderLabel-CXspAmb0.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-Ctffpokv.js";import"./Box-BQB-mg8-.js";import"./styled-Dla1Uw7W.js";import"./Grid-S6xSP1g4.js";import"./Breadcrumbs-BdDJHK0A.js";import"./index-DnL3XN75.js";import"./Popover-B0QqOIFJ.js";import"./Modal-O3HFvYR5.js";import"./Portal-DOTL7Yad.js";import"./List-PtSETj5l.js";import"./ListContext-C4_dHRNu.js";import"./ListItem-CNHhXRSS.js";import"./Link-CMkKbcZq.js";import"./lodash-CwBbdt2Q.js";import"./index-kCs7zF-O.js";import"./useAnalytics-CGIT0JTN.js";import"./useApp-Bi1KQAH_.js";import"./Page-CnAKme8X.js";import"./useMediaQuery-BLlkBj0c.js";import"./Tooltip-CCBqo9iV.js";import"./Popper-rfLbfelh.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
