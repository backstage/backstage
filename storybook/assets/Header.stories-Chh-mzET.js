import{bR as e}from"./iframe-BvJPDVBV.js";import{H as o}from"./Header-DI6K-5Wy.js";import{P as p}from"./Page-DmhVHk_k.js";import{H as r}from"./HeaderLabel-pcAfWltR.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DBkgv7Pp.js";import"./Box-CglGxEOc.js";import"./styled-DeJZjMKc.js";import"./Grid-DM4zpHaB.js";import"./makeStyles-DyOUY6B2.js";import"./Breadcrumbs-Cz8Ujxih.js";import"./index-B9sM2jn7.js";import"./Popover-2GA4cIX_.js";import"./Modal-bN47me76.js";import"./Portal-SYvoszGN.js";import"./List-BnAg8TSB.js";import"./ListContext-DJFdpsTI.js";import"./ListItem-CDg2S178.js";import"./Link-DnetWwwd.js";import"./index-D-x_07yS.js";import"./lodash-B7F9zazX.js";import"./useAnalytics-D2-jQxwo.js";import"./useApp-Db4LI50H.js";import"./Page-OV7vCD5D.js";import"./useMediaQuery-OHj1UhHg.js";import"./Tooltip-bJ-Oj7_3.js";import"./Popper-DlDpjqC3.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
