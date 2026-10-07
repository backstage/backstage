import{j as e}from"./iframe-WUTgIN9N.js";import{H as o}from"./Header-LT_GOhFJ.js";import{P as p}from"./Page-C8nby1zs.js";import{H as r}from"./HeaderLabel-9oxz-72e.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CBisy4g0.js";import"./Box-Dz1w66KV.js";import"./styled-DY6u-KGu.js";import"./Grid-QAEhh-IU.js";import"./makeStyles-D1P9beTg.js";import"./Breadcrumbs-Bg66d0XT.js";import"./index-B9sM2jn7.js";import"./Popover-DNNqIvBY.js";import"./Modal-ByG9teyx.js";import"./Portal-Btr-b7mG.js";import"./List-BwP59E3R.js";import"./ListContext-CASXpzwL.js";import"./ListItem-CuOMG44s.js";import"./Link-CuRGlsNT.js";import"./index-DBvvfb3N.js";import"./lodash-Dgk92AEG.js";import"./useAnalytics-gQW0QBIW.js";import"./useApp-C9iKSsIv.js";import"./Page-NY6EhkoX.js";import"./useMediaQuery-xVVouIkL.js";import"./Tooltip-DKb-uMcn.js";import"./Popper-DyXgZ8-A.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
