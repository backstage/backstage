import{j as e}from"./iframe-DQwDoo1H.js";import{H as o}from"./Header-CwfLROK5.js";import{P as p}from"./Page-CimBbVK9.js";import{H as r}from"./HeaderLabel-CfGW1hx1.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-CfTezaAF.js";import"./Box-8SFFKrct.js";import"./styled-B2hRU9Pw.js";import"./Grid-C1mkfO-A.js";import"./Breadcrumbs-D9Oqk5-y.js";import"./index-DnL3XN75.js";import"./Popover-B_JVK-ll.js";import"./Modal-BBquywqf.js";import"./Portal-0E-kgImq.js";import"./List-mWa-4ocl.js";import"./ListContext-Cn7bnyCl.js";import"./ListItem-Dwvy6ya2.js";import"./Link-Cd-y_3kz.js";import"./lodash-CwBbdt2Q.js";import"./index-HojQYYpO.js";import"./useAnalytics-CM26OCnx.js";import"./useApp-DwlOIlXY.js";import"./Page-BR2IzY1a.js";import"./useMediaQuery-DZWzmd46.js";import"./Tooltip-BrI2VFSp.js";import"./Popper-CDaXhOQ8.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
