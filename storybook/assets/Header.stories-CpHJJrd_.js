import{j as t}from"./iframe-DLcIH_b-.js";import{H as i}from"./Header-CwxL40Vh.js";import{P as a}from"./Page-D2uvDOWn.js";import{H as r}from"./HeaderLabel-D86TM_iN.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DWinocEI.js";import"./Box-DaYdGGLQ.js";import"./styled-CJB3T-Oh.js";import"./Grid-CHWXErYD.js";import"./Breadcrumbs-DNopx3Ky.js";import"./index-B9sM2jn7.js";import"./Popover-C_GbUgIX.js";import"./Modal-DqSKD8Sk.js";import"./Portal-D2sb6xU7.js";import"./List-DgCkyPF-.js";import"./ListContext-C-a3EO19.js";import"./ListItem-BtxOUJ8W.js";import"./Link-Dc4YfHTT.js";import"./lodash-rxUtCtQt.js";import"./index-DTUFdyDi.js";import"./useAnalytics-DDULU5MS.js";import"./useApp-DqnX_mGX.js";import"./Page-CwG6jbxu.js";import"./useMediaQuery-Dfb_HH6S.js";import"./Tooltip-DOrjEsZ_.js";import"./Popper-BhVwcAhT.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
