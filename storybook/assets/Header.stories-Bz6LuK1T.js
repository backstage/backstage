import{j as e}from"./iframe-BteMx7zj.js";import{H as o}from"./Header-D60FURHR.js";import{P as p}from"./Page-BPEz6rOJ.js";import{H as r}from"./HeaderLabel-BJcPoSER.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CwKHoz9A.js";import"./Box-DCV742gE.js";import"./styled-DB7WYmRd.js";import"./Grid-D5ZyNHnh.js";import"./makeStyles-DGUes2su.js";import"./Breadcrumbs-C_z93toh.js";import"./index-B9sM2jn7.js";import"./Popover-B0Ta9ckA.js";import"./Modal-JBVGh4cr.js";import"./Portal-4hBbtLI0.js";import"./List-B42bmojS.js";import"./ListContext-C3evAAl8.js";import"./ListItem-DaGBUtFz.js";import"./Link-DkdOcJD_.js";import"./index-Bgp4cglI.js";import"./lodash-DsduVVuc.js";import"./useAnalytics-CzrCeQK4.js";import"./useApp-CQY1dbvI.js";import"./Page-CdL8wKge.js";import"./useMediaQuery-COHgaOV5.js";import"./Tooltip-BImZRPMG.js";import"./Popper-C0V7tdg-.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
