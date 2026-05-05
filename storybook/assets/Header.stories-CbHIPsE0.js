import{j as e}from"./iframe-CBMR_Zns.js";import{H as o}from"./Header-CkgKKTEF.js";import{P as p}from"./Page-DThnWEUQ.js";import{H as r}from"./HeaderLabel-YiExNEi1.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BdnzpnL9.js";import"./Box-DRo0xUou.js";import"./styled-Fdl9HABt.js";import"./Grid-Dj5TTCpv.js";import"./makeStyles-sF8PfItD.js";import"./Breadcrumbs-BlJL-x40.js";import"./index-B9sM2jn7.js";import"./Popover-CM_pJ0Em.js";import"./Modal-Bvyfvxh5.js";import"./Portal-HQVuNq59.js";import"./List-yyB1VOVV.js";import"./ListContext-B9Lnotut.js";import"./ListItem-DwcTS-Gk.js";import"./Link-DSfdg0tL.js";import"./index-BkiKfy6N.js";import"./lodash-CkAY2xSD.js";import"./useAnalytics-2o7uH7x2.js";import"./useApp-CBwGPM4M.js";import"./Page-BBtdj0F4.js";import"./useMediaQuery-ySAN6sPr.js";import"./Tooltip-C_Z4nOgm.js";import"./Popper-7279CciU.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
