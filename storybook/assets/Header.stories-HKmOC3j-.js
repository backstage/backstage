import{j as t}from"./iframe-CDQkRPtg.js";import{H as i}from"./Header-Dt2FLLCf.js";import{P as a}from"./Page-D4j9yfN-.js";import{H as r}from"./HeaderLabel-CGWS-wlS.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CpPTXBMe.js";import"./Box-CFWJqO9C.js";import"./styled-CcM8fDvt.js";import"./Grid-CLxLLrBH.js";import"./Breadcrumbs-DX6X3w0j.js";import"./index-B9sM2jn7.js";import"./Popover-CXspRPX5.js";import"./Modal-BVCBWYhk.js";import"./Portal-uMAxVVb4.js";import"./List-Ciyy1sk9.js";import"./ListContext-C9VfLDtj.js";import"./ListItem-CsL3oSDi.js";import"./Link-BIWx4pmj.js";import"./lodash-m4O8l6WS.js";import"./index-SymPTtRB.js";import"./useAnalytics-SrifWrGy.js";import"./useApp-C8xAL1g0.js";import"./Page-BZ8ijXHe.js";import"./useMediaQuery-aoA_kWuI.js";import"./Tooltip-BVQgiQsu.js";import"./Popper-fSAvrd0-.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { type } = args;

  return (
    <Page themeId={type}>
      <Header type="home" title="This is a title" subtitle="This is a subtitle">
        {labels}
      </Header>
    </Page>
  );
};
`,...e.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: {
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
}`,...e.parameters?.docs?.source}}};const R=["Default"];export{e as Default,R as __namedExportsOrder,N as default};
