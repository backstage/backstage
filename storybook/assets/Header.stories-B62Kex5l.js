import{j as e}from"./iframe-Cm1o1Xbd.js";import{H as o}from"./Header-BskMvo2x.js";import{P as p}from"./Page-C-5WdXsf.js";import{H as r}from"./HeaderLabel-Z0FEIeFX.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BFrBNpMp.js";import"./Box-H3EEpFmb.js";import"./styled-CDaxGVWn.js";import"./Grid-Bci0B9zS.js";import"./makeStyles-CgDsK_IC.js";import"./Breadcrumbs-DHGQkIzw.js";import"./index-B9sM2jn7.js";import"./Popover-CsHm-zYv.js";import"./Modal-DcI2lTu0.js";import"./Portal-BCJJ0GKL.js";import"./List-DSQEbQUU.js";import"./ListContext-Bcv2AtVr.js";import"./ListItem-B3id05WU.js";import"./Link-BujjMqyX.js";import"./index-Dmtd4Pzp.js";import"./lodash-DTaZxSKz.js";import"./useAnalytics-BEwOoq4N.js";import"./useApp-Pblw4TFB.js";import"./Page-DbJEwEi2.js";import"./useMediaQuery-BDIGYRM6.js";import"./Tooltip-CCT5u6cY.js";import"./Popper-FZKJk7TA.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
