import{j as e}from"./iframe-C8ExrwzU.js";import{H as o}from"./Header-B7KIFo_l.js";import{P as p}from"./Page-axKtgc5c.js";import{H as r}from"./HeaderLabel-9ztDfBNP.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-C7QrBxsC.js";import"./Box-DKI1NtYF.js";import"./styled-BZchgpfg.js";import"./Grid-DspeJWIy.js";import"./Breadcrumbs-BRuFgC0x.js";import"./index-DnL3XN75.js";import"./Popover-CXulOKja.js";import"./Modal-DbOcvVvU.js";import"./Portal-BvPm8y4I.js";import"./List-D4oyelOm.js";import"./ListContext-D23aAr-N.js";import"./ListItem-DGmfxxZu.js";import"./Link-D0uGQ-EQ.js";import"./lodash-CwBbdt2Q.js";import"./index-BgOC1FTX.js";import"./useAnalytics-BlYc1avD.js";import"./useApp-C7pfrKGm.js";import"./Page-D4f1JNil.js";import"./useMediaQuery-DRkeK415.js";import"./Tooltip-rFR9MD6z.js";import"./Popper-BQ20DEXn.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
