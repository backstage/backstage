import{j as e}from"./iframe-CbQECOPA.js";import{H as o}from"./Header-COyFwwbm.js";import{P as p}from"./Page-CgkwVRDZ.js";import{H as r}from"./HeaderLabel-Cvk6bctg.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CPJoqLRH.js";import"./Box-DOhKBQ33.js";import"./styled-DdgLXSlU.js";import"./Grid-cKtNofK9.js";import"./makeStyles-HVqxQmkH.js";import"./Breadcrumbs-C3Dx5Vcm.js";import"./index-B9sM2jn7.js";import"./Popover-D_Pxx585.js";import"./Modal-B48yr6B8.js";import"./Portal-D3rLwoaq.js";import"./List-BstmsSO-.js";import"./ListContext-T-wjkpAE.js";import"./ListItem-CbvLjSw5.js";import"./Link-BBVA48MJ.js";import"./index-Cfqd6aij.js";import"./lodash-CAc9w3DN.js";import"./useAnalytics-DnyaSYZ-.js";import"./useApp-BfdMvggH.js";import"./Page-CiA0Y8UO.js";import"./useMediaQuery-BK60kuMK.js";import"./Tooltip-Cb_uSWfR.js";import"./Popper-DXjKUDjc.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
