import{j as e}from"./iframe-C773ayyW.js";import{H as o}from"./Header-CtjFyNoi.js";import{P as p}from"./Page-DmA_gFK6.js";import{H as r}from"./HeaderLabel-50YDpEiR.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-Chu21SiF.js";import"./Box-c_uSXZkq.js";import"./styled-EjF9N2BZ.js";import"./Grid-oO_1iSro.js";import"./Breadcrumbs-8ZRDIoN3.js";import"./index-DnL3XN75.js";import"./Popover-BpAOnTzO.js";import"./Modal-t1QUaF78.js";import"./Portal-CQJvHB_7.js";import"./List-BAYQ25-v.js";import"./ListContext-BwXeXg0F.js";import"./ListItem-ByJ_H4o2.js";import"./Link-88zF7xCS.js";import"./lodash-CwBbdt2Q.js";import"./index-B7-NdQX-.js";import"./useAnalytics-BUXUfjUP.js";import"./useApp-p5rHYLk0.js";import"./Page-BUVnWZDJ.js";import"./useMediaQuery-9UL9YuF5.js";import"./Tooltip-BuBe4fE-.js";import"./Popper-C-ZRE_0u.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
