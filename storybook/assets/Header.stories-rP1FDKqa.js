import{bR as e}from"./iframe-B8uJzJnC.js";import{H as o}from"./Header-DB3m8PUh.js";import{P as p}from"./Page-DqY-GmGp.js";import{H as r}from"./HeaderLabel-7VV5D1nr.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BQG3zB_d.js";import"./Box-C1vqOm76.js";import"./styled-BF0ejy4K.js";import"./Grid-oRgMNHPR.js";import"./makeStyles-CENq9NVb.js";import"./Breadcrumbs-DtuPaCbx.js";import"./index-B9sM2jn7.js";import"./Popover-sx9CoWmf.js";import"./Modal-DJmgbmQD.js";import"./Portal-BKHkFN--.js";import"./List-jJMlgd41.js";import"./ListContext-DB1EvxRt.js";import"./ListItem-BUvXVTsE.js";import"./Link-p9F1wzce.js";import"./index-CrkExXws.js";import"./lodash-D9y7SekR.js";import"./useAnalytics-DmS_ziXv.js";import"./useApp-Crzm4FAT.js";import"./Page-BG8jRMeh.js";import"./useMediaQuery-C29DkaWE.js";import"./Tooltip-BlZcN-wI.js";import"./Popper-C5La47k6.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
