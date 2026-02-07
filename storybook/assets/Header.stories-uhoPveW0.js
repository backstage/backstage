import{j as t}from"./iframe-CNJ8DcrC.js";import{H as i}from"./Header-BOH7GC8J.js";import{P as a}from"./Page-D9LCMz_f.js";import{H as r}from"./HeaderLabel-BPx-6ZxG.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CbxO8Yys.js";import"./Box-CtI-kND1.js";import"./styled-CIO5_I8O.js";import"./Grid-DnFVy6t2.js";import"./Breadcrumbs-BSyZhqX4.js";import"./index-B9sM2jn7.js";import"./Popover-BJ4QSGHZ.js";import"./Modal-RnbSc_sU.js";import"./Portal-C64Jz60P.js";import"./List-3BFbilF4.js";import"./ListContext--5bBRzIF.js";import"./ListItem-31tIz_LL.js";import"./Link-UFLrOQPe.js";import"./lodash-Czox7iJy.js";import"./index-DkthXm2e.js";import"./useAnalytics-BIDW8Yu5.js";import"./useApp-ulf7OiyD.js";import"./Page-CWz75K8d.js";import"./useMediaQuery-BTaPP8B3.js";import"./Tooltip-D6Gn2cGq.js";import"./Popper-DrUAX_Wn.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
