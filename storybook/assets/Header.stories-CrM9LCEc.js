import{bR as e}from"./iframe-BErNvpjr.js";import{H as o}from"./Header-BDczHxsV.js";import{P as p}from"./Page-D_1rGN4V.js";import{H as r}from"./HeaderLabel-DbvQnx6q.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DHJRiHDI.js";import"./Box-DlU-DYqp.js";import"./styled-CONJ26HT.js";import"./Grid-DJysy46s.js";import"./makeStyles-BfJTzYxE.js";import"./Breadcrumbs-CzAg7l2w.js";import"./index-B9sM2jn7.js";import"./Popover-D2YngEUh.js";import"./Modal-DmtspI82.js";import"./Portal-DH1smPT-.js";import"./List-D-_MzgLt.js";import"./ListContext-uCf9E0gM.js";import"./ListItem-CeLlFv2m.js";import"./Link-CW9uhsyO.js";import"./index-CCyVLSfT.js";import"./lodash-0cH3ibhz.js";import"./useAnalytics-AQKAppCK.js";import"./useApp-C0t03fHF.js";import"./Page-JoqOoU0d.js";import"./useMediaQuery-CcMOJwRy.js";import"./Tooltip-XOteqErZ.js";import"./Popper-CpVTDC7R.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
