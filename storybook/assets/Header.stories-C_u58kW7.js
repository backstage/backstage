import{bR as e}from"./iframe-A5q7KvPV.js";import{H as o}from"./Header-CDnt-yaH.js";import{P as p}from"./Page-brC4FiQE.js";import{H as r}from"./HeaderLabel-DGPaeXdD.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BoyF_r2X.js";import"./Box-Do1kLFaD.js";import"./styled-CaiGGCTB.js";import"./Grid-B2YGGSgc.js";import"./makeStyles-BSDvNkE_.js";import"./Breadcrumbs-ADHlt2Cm.js";import"./index-B9sM2jn7.js";import"./Popover-X-ryUqSd.js";import"./Modal-NqX8GTQ0.js";import"./Portal-CYnqZvqi.js";import"./List-BHb0DGH0.js";import"./ListContext-BrmWluE9.js";import"./ListItem-CLjawmK4.js";import"./Link-BMgV47st.js";import"./index-CPIaraR9.js";import"./lodash-9IYu6p8I.js";import"./useAnalytics-Ds2gUWuY.js";import"./useApp-Rwr12CC0.js";import"./Page-JrUQwGra.js";import"./useMediaQuery-Cc_uExhe.js";import"./Tooltip-DV_BwGfD.js";import"./Popper-FC50uWcj.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
