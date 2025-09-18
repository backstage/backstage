import{j as e}from"./iframe-COb0l9Ot.js";import{H as o}from"./Header-CnNkKnPA.js";import{P as p}from"./Page-DDoUfrX7.js";import{H as r}from"./HeaderLabel-B0TDHC7Z.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-DfLP-98t.js";import"./Box-DdeU9hBZ.js";import"./styled-COzJBZos.js";import"./Grid-YEqTPm11.js";import"./Breadcrumbs-Dx9JUDX_.js";import"./index-DnL3XN75.js";import"./Popover-aodZVFnE.js";import"./Modal-Da3_mpt5.js";import"./Portal-DhkyDrOm.js";import"./List-C_SD4FZR.js";import"./ListContext-C2fYDrJh.js";import"./ListItem-BXV5PRVp.js";import"./Link-Ct1evR27.js";import"./lodash-CwBbdt2Q.js";import"./index-C2rNmFdC.js";import"./useAnalytics-BEClZYF1.js";import"./useApp-DOIE3BzV.js";import"./Page-DyUMVze1.js";import"./useMediaQuery-C-1-jz19.js";import"./Tooltip-DiHf9MQ-.js";import"./Popper-Jg-KIdHc.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
