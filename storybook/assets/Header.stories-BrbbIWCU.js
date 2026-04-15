import{j as e}from"./iframe-BZbCHoUM.js";import{H as o}from"./Header-sunCSIgg.js";import{P as p}from"./Page-BKj1CH9i.js";import{H as r}from"./HeaderLabel-viuEk6Az.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D0L0Z7cG.js";import"./Box-DY6-eBkT.js";import"./styled-DCK0eGG-.js";import"./Grid-MM8AuGcB.js";import"./makeStyles-CqvbDVNY.js";import"./Breadcrumbs-DFbRP2VZ.js";import"./index-B9sM2jn7.js";import"./Popover-BIOnDNcK.js";import"./Modal-DVelOBwr.js";import"./Portal-ByyC8-qY.js";import"./List-CodZ-AVF.js";import"./ListContext-CbM2lO0s.js";import"./ListItem-CUvfBfLi.js";import"./Link-BTIv8AuK.js";import"./index-CkvjDYOq.js";import"./lodash-ztOqvY5v.js";import"./useAnalytics-CRERthYg.js";import"./useApp-gzInJQTH.js";import"./Page-BqqfkJCt.js";import"./useMediaQuery-vsoiSRSO.js";import"./Tooltip-CdMmLUhb.js";import"./Popper-DDFF7RGu.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
