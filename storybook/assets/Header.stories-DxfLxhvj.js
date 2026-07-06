import{bR as e}from"./iframe-D-U3XCi_.js";import{H as o}from"./Header-DB1zlsr9.js";import{P as p}from"./Page-xBsRXPu5.js";import{H as r}from"./HeaderLabel-CE2NU9ob.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B17Mc8-j.js";import"./Box-CiofjXgh.js";import"./styled-B4F0dw99.js";import"./Grid-3D9u4l8r.js";import"./makeStyles-BHo2IBLU.js";import"./Breadcrumbs-BwVL9lJz.js";import"./index-B9sM2jn7.js";import"./Popover-DczWzLzz.js";import"./Modal-CvfL3O1K.js";import"./Portal-Cx0C7hOu.js";import"./List-Bt_VxheE.js";import"./ListContext-DMa2K4C7.js";import"./ListItem-BICUgtEX.js";import"./Link-BBOsyqXp.js";import"./index-DUl2QbDn.js";import"./lodash-KEAh9Gl1.js";import"./useAnalytics-B1tdSmq6.js";import"./useApp-CXgo0NWV.js";import"./Page-78Laz2bL.js";import"./useMediaQuery-Y3K8kokR.js";import"./Tooltip-CUhzeySE.js";import"./Popper-TlI-xYIc.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
