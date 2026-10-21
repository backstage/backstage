import{j as e}from"./iframe-CSz7VfT3.js";import{H as o}from"./Header-BJrve6mv.js";import{P as p}from"./Page-C1FdPcxH.js";import{H as r}from"./HeaderLabel-BKfe1i9W.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B35Trdgt.js";import"./Box-Bz86QYYh.js";import"./styled-BZdOrxc2.js";import"./Grid-BK-uRE6j.js";import"./makeStyles-CC8EE5Qs.js";import"./Breadcrumbs-4afW8nO_.js";import"./index-B9sM2jn7.js";import"./Popover-kVmgLK9-.js";import"./Modal-FfDXHIjA.js";import"./Portal-Cd8SI1ja.js";import"./List-BSep9TdZ.js";import"./ListContext-PRAg6M82.js";import"./ListItem-CIKs1J7B.js";import"./Link-Df0pdh_K.js";import"./index-CZ0nvQAS.js";import"./lodash-KZId8LWf.js";import"./useAnalytics-CbLpUIzI.js";import"./useApp-BQDc9GUX.js";import"./Page-DcZAeA-t.js";import"./useMediaQuery-tkiFqrau.js";import"./Tooltip-Cl-v2oJK.js";import"./Popper-B-IDmjxH.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
