import{bR as e}from"./iframe-CNmrqhdp.js";import{H as o}from"./Header-Bl2TOZsH.js";import{P as p}from"./Page-BMQ287yZ.js";import{H as r}from"./HeaderLabel-Bw5T0O7e.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C3611U3L.js";import"./Box-1MBd1NdD.js";import"./styled-wlFTiasm.js";import"./Grid-BGPHOMQP.js";import"./makeStyles-CoULisOM.js";import"./Breadcrumbs-BbfyfgUG.js";import"./index-B9sM2jn7.js";import"./Popover-DXsb97Zc.js";import"./Modal-Bj4IWEm7.js";import"./Portal-BeWhklMr.js";import"./List-ahum0BRu.js";import"./ListContext-B5UlMvnw.js";import"./ListItem-B6bQ60ol.js";import"./Link-Buntv2pG.js";import"./index-CecqzQJ6.js";import"./lodash-DcRUHytK.js";import"./useAnalytics-BfmOd9pS.js";import"./useApp-DjNgU9QR.js";import"./Page-DE9edhl1.js";import"./useMediaQuery-pqUoJTtU.js";import"./Tooltip-BQ2DH04K.js";import"./Popper-zherBlvX.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
