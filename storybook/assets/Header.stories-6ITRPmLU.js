import{bR as e}from"./iframe-DUP7Kr9f.js";import{H as o}from"./Header-BFCsL7tc.js";import{P as p}from"./Page-YeJ0-4ld.js";import{H as r}from"./HeaderLabel-CBArLzmZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-7xdRLG61.js";import"./Box-D9WPCwYT.js";import"./styled-Cg0H8rnn.js";import"./Grid-Cd5C4HAL.js";import"./makeStyles-Dd-C4kag.js";import"./Breadcrumbs-BaXR-Nxe.js";import"./index-B9sM2jn7.js";import"./Popover-CDJLQ0IP.js";import"./Modal-W9vmQpMY.js";import"./Portal-D333kJ5H.js";import"./List-C1Kz1ZAt.js";import"./ListContext-Cuf4_omo.js";import"./ListItem-CWB1REQF.js";import"./Link-BDaMnIWB.js";import"./index-C5YDA-DN.js";import"./lodash-1-sk3vtf.js";import"./useAnalytics-DTHv5VM-.js";import"./useApp-DuupV57f.js";import"./Page-YEjIaNGC.js";import"./useMediaQuery-Yd7n6uPd.js";import"./Tooltip-B9D26I6o.js";import"./Popper-DDikz6cp.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
