import{j as e}from"./iframe-Q4ctuRUv.js";import{H as o}from"./Header-CBRsF0ha.js";import{P as p}from"./Page-Bbjuk3Mv.js";import{H as r}from"./HeaderLabel-D9l5VBF-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BpQzIwKf.js";import"./Box-CI4CWvmp.js";import"./styled-CRG88ni7.js";import"./Grid-DcmUA9RW.js";import"./makeStyles-8oAJJB3q.js";import"./Breadcrumbs-DR8IxrpU.js";import"./index-B9sM2jn7.js";import"./Popover-BfcUD1WF.js";import"./Modal-Tor9I59X.js";import"./Portal-qlFGj9vk.js";import"./List-Duxw_2f-.js";import"./ListContext-CfWdnzwf.js";import"./ListItem-CXSBZTxW.js";import"./Link-VoSzpIdj.js";import"./index-Cnxeo_nc.js";import"./lodash-jLyg5rJ1.js";import"./useAnalytics-DuXqog2R.js";import"./useApp-DQVv0gHI.js";import"./Page-C_Qz1067.js";import"./useMediaQuery-Dzx4e1Xi.js";import"./Tooltip-DvQQOI_0.js";import"./Popper-BII3FvzI.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};
