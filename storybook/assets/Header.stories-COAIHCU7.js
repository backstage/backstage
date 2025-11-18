import{j as e}from"./iframe-BJLAQiny.js";import{H as o}from"./Header-OlHJ3jUF.js";import{P as p}from"./Page-D9t9GkKw.js";import{H as r}from"./HeaderLabel-IB8nc4X6.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-C6E4itJJ.js";import"./Box-DBjVidWA.js";import"./styled-Dbum34QX.js";import"./Grid-85KaXqj6.js";import"./Breadcrumbs-PWhEpKhh.js";import"./index-DnL3XN75.js";import"./Popover-BTSzFMjF.js";import"./Modal-98ZwNGha.js";import"./Portal-B2YIacrT.js";import"./List-DMFoD1Fa.js";import"./ListContext-HC4v7bkz.js";import"./ListItem-Ccj_bLuX.js";import"./Link-BsQxZTCc.js";import"./lodash-CwBbdt2Q.js";import"./index-bnZRQeHC.js";import"./useAnalytics-W203HJ0-.js";import"./useApp-BTkCnRE2.js";import"./Page-B4woTrdX.js";import"./useMediaQuery-CEtGkehQ.js";import"./Tooltip-DWt_B2xO.js";import"./Popper-DQtSbLkc.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
