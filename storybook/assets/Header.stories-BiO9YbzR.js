import{j as e}from"./iframe-QBX5Mcuo.js";import{H as o}from"./Header-Pn9UwM6R.js";import{P as p}from"./Page-3RUo4jF9.js";import{H as r}from"./HeaderLabel-Dwt898cG.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-C7Wh8K2R.js";import"./Box-DE6c26DR.js";import"./styled-BjXftXcZ.js";import"./Grid-Q_BfCJNG.js";import"./Breadcrumbs-BKW3gd_J.js";import"./index-DnL3XN75.js";import"./Popover-B8q1n2QL.js";import"./Modal-B7uRaYS1.js";import"./Portal-D97HJh_z.js";import"./List-CwkTxoFK.js";import"./ListContext-BfMtnPb8.js";import"./ListItem-CcSyfWmu.js";import"./Link-C2fIupIe.js";import"./lodash-CwBbdt2Q.js";import"./index-CDF8GVFg.js";import"./useAnalytics-Pg_QG9Iq.js";import"./useApp-B1pSEwwD.js";import"./Page-BMhFzfNN.js";import"./useMediaQuery-D5mDDKvt.js";import"./Tooltip-DOW7o-0E.js";import"./Popper-BpKCcSKx.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
