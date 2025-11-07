import{j as e}from"./iframe-DqJQ9uPs.js";import{H as o}from"./Header-pdXbc-VE.js";import{P as p}from"./Page-B5wwLJrk.js";import{H as r}from"./HeaderLabel-NCNehMZ3.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-yMOzAhtb.js";import"./Box-7v7Ku6kY.js";import"./styled-DV7YmZBO.js";import"./Grid-KKLALRV6.js";import"./Breadcrumbs-Db4gfWZu.js";import"./index-DnL3XN75.js";import"./Popover-O0XQDvdf.js";import"./Modal-DbdYSBMO.js";import"./Portal-CAVLkONX.js";import"./List-HqDhN-yv.js";import"./ListContext-DWNGGGl9.js";import"./ListItem-DIBtNilh.js";import"./Link-ClrQx1QP.js";import"./lodash-CwBbdt2Q.js";import"./index-DalzLXVm.js";import"./useAnalytics-CfDtSbQu.js";import"./useApp-ByL28iDl.js";import"./Page-D2jEA7IO.js";import"./useMediaQuery-DN21eh0U.js";import"./Tooltip-6CCJUAWE.js";import"./Popper-DOaVy74A.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
