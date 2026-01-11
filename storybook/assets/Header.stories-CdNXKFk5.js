import{j as t}from"./iframe-C0ztlCqi.js";import{H as i}from"./Header-CqWWQjkh.js";import{P as a}from"./Page-C4YZJdq_.js";import{H as r}from"./HeaderLabel-3H8Un9Rg.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-5HTPkvHS.js";import"./Box-CzQDPnzy.js";import"./styled-CWdZ-Z1U.js";import"./Grid-BJIH9AcQ.js";import"./Breadcrumbs-B4wDjvX7.js";import"./index-B9sM2jn7.js";import"./Popover-DUDe_MTy.js";import"./Modal-iwdO8Psb.js";import"./Portal-DgY2uLlM.js";import"./List-dufFXco6.js";import"./ListContext-CkQIvbtj.js";import"./ListItem-BjSKqJNR.js";import"./Link-BUMam9f4.js";import"./lodash-DLuUt6m8.js";import"./index-BSDdaq1o.js";import"./useAnalytics-BXjJbJ2d.js";import"./useApp-WkaDZJI-.js";import"./Page-KkgaXOKX.js";import"./useMediaQuery-BccW8jYJ.js";import"./Tooltip-BUzhfLp0.js";import"./Popper-BpDPZdlA.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
