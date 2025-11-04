import{j as e}from"./iframe-CuO26Rmv.js";import{H as o}from"./Header-BViuvfaH.js";import{P as p}from"./Page-DnTe1CCh.js";import{H as r}from"./HeaderLabel-DP6AJ2i2.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-DHs2JXTs.js";import"./Box-CU-U4ibu.js";import"./styled-C8K_EIFt.js";import"./Grid-BfYuvVEF.js";import"./Breadcrumbs-BVDFc7ao.js";import"./index-DnL3XN75.js";import"./Popover-qvG1tW29.js";import"./Modal-6Ajkd_zG.js";import"./Portal-BcfglCa0.js";import"./List-BAIPzTEx.js";import"./ListContext-0ULPV768.js";import"./ListItem-D5_amKXt.js";import"./Link-DPuqs8WZ.js";import"./lodash-CwBbdt2Q.js";import"./index-CA92LH--.js";import"./useAnalytics-CdEHywY9.js";import"./useApp-BYLVa0iu.js";import"./Page-2-O3scU7.js";import"./useMediaQuery-DbvZc6lp.js";import"./Tooltip-DqE-hoU6.js";import"./Popper-DfJjIkwB.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
