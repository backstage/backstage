import{bR as e}from"./iframe-BHoENCVc.js";import{H as o}from"./Header-DsCMhpn8.js";import{P as p}from"./Page-DJsJ30YO.js";import{H as r}from"./HeaderLabel-B7ntT0Ie.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DWi2E9z-.js";import"./Box-69iekKeq.js";import"./styled-DRPdZI7s.js";import"./Grid-DQ6GJWoC.js";import"./makeStyles-DPkHg9n9.js";import"./Breadcrumbs-pEm8tNGX.js";import"./index-B9sM2jn7.js";import"./Popover-DAuhqhg6.js";import"./Modal-B95uljuB.js";import"./Portal-BkPCEqjv.js";import"./List-BP5zaq_8.js";import"./ListContext-vBgF8v9C.js";import"./ListItem-CyAObhT7.js";import"./Link-DbaMgic8.js";import"./index-CwRuBl_7.js";import"./lodash-C1BWqHDU.js";import"./useAnalytics-Cx5c0pM3.js";import"./useApp-D78Q1Dx1.js";import"./Page-CQ7weP4C.js";import"./useMediaQuery-BO2hyU7Z.js";import"./Tooltip-C4aWDmy0.js";import"./Popper-BGschj03.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
