import{j as e}from"./iframe-BIybnMXI.js";import{H as o}from"./Header-C-oJtBLY.js";import{P as p}from"./Page-qjPESthF.js";import{H as r}from"./HeaderLabel-DVDPJHzx.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C9URw3rn.js";import"./Box-DUmu2mdv.js";import"./styled-BLvF1qNR.js";import"./Grid-CKJ_Bjce.js";import"./makeStyles-cGXTSjHb.js";import"./Breadcrumbs-DkIq9CL2.js";import"./index-B9sM2jn7.js";import"./Popover-Dm8aKUuZ.js";import"./Modal-R9QZiaCt.js";import"./Portal-D4Q745Gi.js";import"./List-BskmEb7a.js";import"./ListContext-Dy9wnKpt.js";import"./ListItem-B-2MPIj6.js";import"./Link-DXi97D8o.js";import"./index-C71EKvje.js";import"./lodash-BF9MgLAH.js";import"./useAnalytics-Cee1mTCP.js";import"./useApp-B-DAdzWT.js";import"./Page-CaQRfOEd.js";import"./useMediaQuery-BXNb1c5b.js";import"./Tooltip-BpqzGmpb.js";import"./Popper-CVumtf5-.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
