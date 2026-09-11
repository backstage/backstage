import{bQ as e}from"./iframe-CZAQRplz.js";import{H as o}from"./Header-BS_pZOIe.js";import{P as p}from"./Page-BzFDLziN.js";import{H as r}from"./HeaderLabel-BQVAF9-p.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C7yF0Ocq.js";import"./Box-BT6vekTm.js";import"./styled-D7sM8uiQ.js";import"./Grid-DzCeEWhe.js";import"./makeStyles-Cb2cCzWc.js";import"./Breadcrumbs-C_rfA2nu.js";import"./index-B9sM2jn7.js";import"./Popover-VvawbFx0.js";import"./Modal-B_tBDNA-.js";import"./Portal-Dqju9w89.js";import"./List-DLb1QRd3.js";import"./ListContext-C7UxNvJ1.js";import"./ListItem-ZGqbZKXu.js";import"./Link-CvqIzusg.js";import"./index-DWX2uXpx.js";import"./lodash-CsxFj9lc.js";import"./useAnalytics-BlCfiJ5k.js";import"./useApp-BwYv7u9J.js";import"./Page-BvO7r0wj.js";import"./useMediaQuery-DejC0DR_.js";import"./Tooltip-D4W_0aOE.js";import"./Popper-BjcrMdDX.js";const Q={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,Q as default};
