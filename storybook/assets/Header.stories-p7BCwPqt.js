import{j as e}from"./iframe-Bqhsa6Sh.js";import{H as o}from"./Header-DDwEfqs0.js";import{P as p}from"./Page-DOhpmXw_.js";import{H as r}from"./HeaderLabel-DzoyypAK.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-CedEavMf.js";import"./Box-7oeyrs_b.js";import"./styled-PHRrol5o.js";import"./Grid-B6o2V4N5.js";import"./Breadcrumbs-CIi7NQ4c.js";import"./index-DnL3XN75.js";import"./Popover-CV1Qmkiv.js";import"./Modal-Bj_JGdVD.js";import"./Portal-C0qyniir.js";import"./List-DhlESJBF.js";import"./ListContext-42q0jwAr.js";import"./ListItem-BUcGiLuR.js";import"./Link-BYO-u9Rv.js";import"./lodash-CwBbdt2Q.js";import"./index-C3od-xDV.js";import"./useAnalytics-V0sqNxHK.js";import"./useApp-DjjYoyBR.js";import"./Page-7Oa-4ED0.js";import"./useMediaQuery-BFRIwwZI.js";import"./Tooltip-BcEgbTA-.js";import"./Popper-CVY8x9L-.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
