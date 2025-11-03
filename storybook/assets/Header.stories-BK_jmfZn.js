import{j as e}from"./iframe-B1bS8kNu.js";import{H as o}from"./Header-Z2rDjE87.js";import{P as p}from"./Page-GSvh4wux.js";import{H as r}from"./HeaderLabel-Bv9whzGW.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-Dq4v_l6d.js";import"./Box-kUekMc6O.js";import"./styled-CICePBTu.js";import"./Grid-C88sFnNl.js";import"./Breadcrumbs-BvEi36SM.js";import"./index-DnL3XN75.js";import"./Popover-cbtVu3bF.js";import"./Modal-DljuX6iF.js";import"./Portal-CbatMowK.js";import"./List-vAsLcuDY.js";import"./ListContext-Dr49CUeJ.js";import"./ListItem-F3f87gTr.js";import"./Link--XlSoX1z.js";import"./lodash-CwBbdt2Q.js";import"./index-BB5XVHud.js";import"./useAnalytics-CWJQ4paP.js";import"./useApp-DrlXjDDm.js";import"./Page-0yY53fia.js";import"./useMediaQuery-CxBmQg7K.js";import"./Tooltip-CpvnZrMV.js";import"./Popper-DI0r4x2S.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
