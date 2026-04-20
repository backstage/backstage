import{j as e}from"./iframe-ePBrCY0J.js";import{H as o}from"./Header-jmEuowmB.js";import{P as p}from"./Page-LFBN2FoP.js";import{H as r}from"./HeaderLabel-Nc5Njyeb.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cyb-JcnQ.js";import"./Box-BIZWnQoQ.js";import"./styled-CDpOoIv_.js";import"./Grid-CKyhvvof.js";import"./makeStyles-B9PTu9_J.js";import"./Breadcrumbs-BL4cIWK0.js";import"./index-B9sM2jn7.js";import"./Popover-DEo0R8E-.js";import"./Modal-D6s-SbHh.js";import"./Portal-IwhLFSRr.js";import"./List-Bvl_gPz2.js";import"./ListContext-3JA2nXVD.js";import"./ListItem-U6U0AzIJ.js";import"./Link-ccW_HqBW.js";import"./index-CGuJQhUk.js";import"./lodash-ByXYgI5E.js";import"./useAnalytics-DJbOQ4-_.js";import"./useApp-BF4JYTvB.js";import"./Page-CGpi6-50.js";import"./useMediaQuery-DgA1P5Eu.js";import"./Tooltip-BVbTMuZj.js";import"./Popper-OUHWMupJ.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
