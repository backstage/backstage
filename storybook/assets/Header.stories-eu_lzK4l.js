import{j as e}from"./iframe-C4dPZ8kl.js";import{H as o}from"./Header-C2aiGcHY.js";import{P as p}from"./Page-CvCNkVdf.js";import{H as r}from"./HeaderLabel-DTID03zi.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-DWReSuWO.js";import"./Box-COTlPoNf.js";import"./styled-ie_8oXYP.js";import"./Grid-CZkThu2A.js";import"./Breadcrumbs-CsFHds8o.js";import"./index-DnL3XN75.js";import"./Popover-Df7jUf51.js";import"./Modal-Ch6lvVax.js";import"./Portal-C3KrmcYH.js";import"./List-CsFCwjIb.js";import"./ListContext-CZ3AIdLK.js";import"./ListItem-Bx6LKxKb.js";import"./Link-qsu39Qum.js";import"./lodash-CwBbdt2Q.js";import"./index-D_dzg66M.js";import"./useAnalytics-DSRHfRk8.js";import"./useApp-DcP6b98f.js";import"./Page-DoTCwu2o.js";import"./useMediaQuery-Dhiz4raN.js";import"./Tooltip-BFnVM2Xk.js";import"./Popper-0_gUpV4D.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
