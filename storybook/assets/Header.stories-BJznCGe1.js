import{j as e}from"./iframe-Dl820wOI.js";import{H as o}from"./Header-yrdti4br.js";import{P as p}from"./Page-BAGycwB_.js";import{H as r}from"./HeaderLabel-BQDIa8Nz.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-C3jO1hGc.js";import"./Box-DfeHQWeE.js";import"./styled-kfqHWboF.js";import"./Grid-BlSwvCAu.js";import"./Breadcrumbs-BVeaUTqf.js";import"./index-DnL3XN75.js";import"./Popover-DbocIA8t.js";import"./Modal-DWfTsRMv.js";import"./Portal-jLwVh-5o.js";import"./List-CHKnkhL9.js";import"./ListContext-Cbtrueie.js";import"./ListItem-Bj_ICtqE.js";import"./Link-BTOOY6TC.js";import"./lodash-CwBbdt2Q.js";import"./index-Dc9OD8OQ.js";import"./useAnalytics-H66oe0oN.js";import"./useApp-B5QaOHzA.js";import"./Page-z61xkk9v.js";import"./useMediaQuery-BWcvjqKr.js";import"./Tooltip-DqMu2rNF.js";import"./Popper-CWjD6Kfi.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
