import{j as e}from"./iframe-DLxOzT4t.js";import{H as o}from"./Header-CsvVkUQW.js";import{P as p}from"./Page-BNGV7Jqh.js";import{H as r}from"./HeaderLabel-DwS5IFoY.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-RrVWyDd3.js";import"./Box-BEY2IraA.js";import"./styled-C22knZjm.js";import"./Grid-DTcNMdF5.js";import"./Breadcrumbs-BnVBJaCe.js";import"./index-DnL3XN75.js";import"./Popover-D3O0AVPe.js";import"./Modal-7EqbtETg.js";import"./Portal-CdFb3as0.js";import"./List-D0oVWlo0.js";import"./ListContext-CoRXql5V.js";import"./ListItem-C0vbBd3c.js";import"./Link-CRIj9jSl.js";import"./lodash-CwBbdt2Q.js";import"./index-YuKWWjwW.js";import"./useAnalytics-iDMqp06i.js";import"./useApp-CkqCNNj_.js";import"./Page-BeSbjGB5.js";import"./useMediaQuery-NuLbEALT.js";import"./Tooltip-CfLuXrUC.js";import"./Popper-DRx4nqXa.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
