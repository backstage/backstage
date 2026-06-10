import{bR as e}from"./iframe-C0kJxuo3.js";import{H as o}from"./Header-Bd44DdYF.js";import{P as p}from"./Page-B1QYAiZF.js";import{H as r}from"./HeaderLabel-AWTd2DZR.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-iHlUWE7f.js";import"./Box-CnWgbgkY.js";import"./styled-D_oPDrlm.js";import"./Grid-C-s0xDvK.js";import"./makeStyles-D5-PJbNp.js";import"./Breadcrumbs-DZ-IrVUp.js";import"./index-B9sM2jn7.js";import"./Popover-DEvxK_jS.js";import"./Modal-jYxltuJv.js";import"./Portal-Bt9mGg9Y.js";import"./List-CPgTpnJc.js";import"./ListContext-DicoL8cb.js";import"./ListItem-Ck6Lxrwn.js";import"./Link-B6P5VGLF.js";import"./index-BwD_LcUE.js";import"./lodash-BJ7VBBcx.js";import"./useAnalytics-X-Bs5xc4.js";import"./useApp-CXLNLZbd.js";import"./Page-s5caOXo6.js";import"./useMediaQuery-CG0UCByO.js";import"./Tooltip-aKqJkO8O.js";import"./Popper-Cp0AdtCe.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
