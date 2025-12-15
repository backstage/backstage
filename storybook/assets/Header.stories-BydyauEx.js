import{j as e}from"./iframe-DpqnIERb.js";import{H as o}from"./Header-CDGs4b3-.js";import{P as p}from"./Page-BMUZJV4W.js";import{H as r}from"./HeaderLabel-DY8eZSB0.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DM8RHdB8.js";import"./Box-B2dMzSz4.js";import"./styled-iMmr_MI_.js";import"./Grid-ByES49Fm.js";import"./Breadcrumbs-BtT-sSWy.js";import"./index-B9sM2jn7.js";import"./Popover-cJal3ZUL.js";import"./Modal-DsN87qYK.js";import"./Portal-BmmQaE8x.js";import"./List-CZbmWexd.js";import"./ListContext-BxawfRoI.js";import"./ListItem-D0Z8ElGo.js";import"./Link-CYlpUQKG.js";import"./lodash-Y_-RFQgK.js";import"./index-DoyRYStT.js";import"./useAnalytics-DvwM4ONZ.js";import"./useApp-BzWSwMGn.js";import"./Page-C_sJTRbJ.js";import"./useMediaQuery-DOy6FFFK.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
