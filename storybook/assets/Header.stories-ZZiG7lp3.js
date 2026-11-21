import{j as e}from"./iframe-81VbGqYS.js";import{H as o}from"./Header-MI85MKLr.js";import{P as p}from"./Page-BI-uxEMb.js";import{H as r}from"./HeaderLabel-ChG-Qzkv.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DhzVEuZU.js";import"./Box-BgoSIZ4q.js";import"./styled-eVahdZR4.js";import"./Grid-DMrlSwZy.js";import"./makeStyles-CLUNqzBM.js";import"./Breadcrumbs-DBxoW7WU.js";import"./index-B9sM2jn7.js";import"./Popover-DLFZ7T5B.js";import"./Modal-FnVT5N6T.js";import"./Portal-QfMZdSdo.js";import"./List-DIoifV4W.js";import"./ListContext-CiutZ7F_.js";import"./ListItem-BwaGLIri.js";import"./Link-DgC69_CC.js";import"./index-CUwVFkQ3.js";import"./lodash-BPAWgrT_.js";import"./useApp-Bu-r3o5K.js";import"./index-BTbib15M.js";import"./useAnalytics-CopnWV3T.js";import"./Page-QJX0Io_W.js";import"./useMediaQuery-C8Gf-FN3.js";import"./Tooltip-BkS0CJ7s.js";import"./Popper-Br0-G0xX.js";const S={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,S as default};
