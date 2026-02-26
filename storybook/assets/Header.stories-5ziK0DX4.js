import{j as t}from"./iframe-DuvNW6Xv.js";import{H as i}from"./Header-BVx1vlms.js";import{P as a}from"./Page-BDZSXjIT.js";import{H as r}from"./HeaderLabel-Cz6p8MLr.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BmvmEmyT.js";import"./makeStyles-Z7w_QLhf.js";import"./Box-DzPLR1xJ.js";import"./styled-D76g4fqW.js";import"./Grid-DlD5tHny.js";import"./Breadcrumbs-B8CuqV58.js";import"./index-B9sM2jn7.js";import"./Popover-DXuECRR4.js";import"./Modal-CGrUoTEz.js";import"./Portal-C6ZvXkAX.js";import"./List-BJbmfEoB.js";import"./ListContext-3Q_S_JMo.js";import"./ListItem-DO5emuSw.js";import"./Link-DuCnaZx-.js";import"./index-CyiwOViA.js";import"./lodash-D4DPSOUM.js";import"./index-Do6NpL29.js";import"./useAnalytics-C22xHozv.js";import"./useApp-CGYzobcC.js";import"./Page-dVG0fkWS.js";import"./useMediaQuery-DP_ZhXQU.js";import"./Tooltip-BU-jYYLq.js";import"./Popper-DYeX4n5i.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...e.parameters?.docs?.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,S as default};
