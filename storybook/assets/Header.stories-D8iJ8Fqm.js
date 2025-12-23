import{j as e}from"./iframe-Hw755TNi.js";import{H as o}from"./Header-BiysVcGs.js";import{P as p}from"./Page-B8o7NAcn.js";import{H as r}from"./HeaderLabel-DUfuWikn.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BlnHPt8L.js";import"./Box-DcpjYi3J.js";import"./styled-qTtGNmm_.js";import"./Grid-w98sXAXk.js";import"./Breadcrumbs-PIJZ01pz.js";import"./index-B9sM2jn7.js";import"./Popover-BfMi8ZLM.js";import"./Modal-DYeoU8Cn.js";import"./Portal-BZ6RZj06.js";import"./List-Z-bLSsG8.js";import"./ListContext-moCHcqFh.js";import"./ListItem-DwV3XkH8.js";import"./Link-BYu3CTsd.js";import"./lodash-Y_-RFQgK.js";import"./index-CMiNgydu.js";import"./useAnalytics-CLuGYyUh.js";import"./useApp-DdUuBagy.js";import"./Page-nh5BnDMg.js";import"./useMediaQuery-C2u3FrRz.js";import"./Tooltip-BwBST4sz.js";import"./Popper-QpCwrVnW.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
