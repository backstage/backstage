import{j as e}from"./iframe-DsaViRt6.js";import{H as o}from"./Header-BCx6tq4S.js";import{P as p}from"./Page-DstKUtfp.js";import{H as r}from"./HeaderLabel-D5mgU-KF.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Baevv1cS.js";import"./Box-CkIMQTPE.js";import"./styled-C9i7J3Hk.js";import"./Grid-8AdasDhF.js";import"./makeStyles-DomhxC8K.js";import"./Breadcrumbs-MrMmoa2f.js";import"./index-B9sM2jn7.js";import"./Popover-B8pTzyF7.js";import"./Modal-Bs2kP0GU.js";import"./Portal-SD3NSScm.js";import"./List-DXgisE-a.js";import"./ListContext-DhuLCPQN.js";import"./ListItem-C0JUr0PJ.js";import"./Link-Ddg_NHNk.js";import"./index-kl08ino_.js";import"./lodash-MieUkT6_.js";import"./useAnalytics-C8e92oTN.js";import"./useApp-Fb2uCB2O.js";import"./Page-Cziyd4_D.js";import"./useMediaQuery-j1eTXKoZ.js";import"./Tooltip-C184FKdw.js";import"./Popper-KpaO9RKc.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
