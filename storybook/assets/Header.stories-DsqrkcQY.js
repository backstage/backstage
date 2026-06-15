import{bR as e}from"./iframe-DQDMWdhR.js";import{H as o}from"./Header-DRdDZ3-Z.js";import{P as p}from"./Page-DNNRq5sX.js";import{H as r}from"./HeaderLabel-R-5DlK9w.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CLp_3av0.js";import"./Box-BSlsrAFI.js";import"./styled-DGFjQDj-.js";import"./Grid-BqTQ24QW.js";import"./makeStyles-B5aW9Q-2.js";import"./Breadcrumbs-Dlv0R-lM.js";import"./index-B9sM2jn7.js";import"./Popover-BFgyghhY.js";import"./Modal-CbfwUxRS.js";import"./Portal-Dba-4_gW.js";import"./List-BphJ6ppe.js";import"./ListContext-K2B4oL84.js";import"./ListItem-DO9NzT1C.js";import"./Link-Cl_RxpbQ.js";import"./index-DY_5w8ej.js";import"./lodash-3i45iK7k.js";import"./useAnalytics-IT8D4hNJ.js";import"./useApp-CTum3p-d.js";import"./Page-CQu11Q2J.js";import"./useMediaQuery--8l9UWnV.js";import"./Tooltip-CHviRUrF.js";import"./Popper-DRhkdNdl.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
