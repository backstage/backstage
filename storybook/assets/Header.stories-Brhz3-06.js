import{j as e}from"./iframe-DgHKkkyr.js";import{H as o}from"./Header-Sqo5Npt3.js";import{P as p}from"./Page-DxmCpfXk.js";import{H as r}from"./HeaderLabel-C2CDvDbh.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BERuOip5.js";import"./Box-3aPVvtAd.js";import"./styled-DQDNGh9h.js";import"./Grid-CynkKdtI.js";import"./makeStyles-BQ4CrWvO.js";import"./Breadcrumbs-ChQ8SvhO.js";import"./index-B9sM2jn7.js";import"./Popover-B9URSecK.js";import"./Modal-5jKjo9Qs.js";import"./Portal-D2_s-m0j.js";import"./List-C0Su0a7g.js";import"./ListContext-C7Aa1vGY.js";import"./ListItem-C3HDGAPX.js";import"./Link-D-_ixZcQ.js";import"./index-VhduaqV-.js";import"./lodash-B6io_9QA.js";import"./useAnalytics-By5KMxBj.js";import"./useApp-H5qXXNde.js";import"./Page-D4-b1IbA.js";import"./useMediaQuery-BYMj495N.js";import"./Tooltip-YbDHNNEo.js";import"./Popper-B20-UClj.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
