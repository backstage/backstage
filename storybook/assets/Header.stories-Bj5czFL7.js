import{j as t}from"./iframe-CafSZihE.js";import{H as i}from"./Header-tlKxwsvS.js";import{P as a}from"./Page-85fk3KJ6.js";import{H as r}from"./HeaderLabel-C8ANzXkP.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cf1lY0we.js";import"./Box-fRbsHjDs.js";import"./styled-XhcyHdDa.js";import"./Grid-CE8ncWjM.js";import"./Breadcrumbs-oo-9rvx-.js";import"./index-B9sM2jn7.js";import"./Popover-DWlOw0Ay.js";import"./Modal-119bZl-Y.js";import"./Portal-W2FhbA1a.js";import"./List-B4E6UX55.js";import"./ListContext-CWAV-zjc.js";import"./ListItem-DVuo4x9u.js";import"./Link-DyiL97g3.js";import"./lodash-Czox7iJy.js";import"./index-CWZByKrh.js";import"./useAnalytics-CkIdISEJ.js";import"./useApp-BWekrYpt.js";import"./Page-BsA9DZk6.js";import"./useMediaQuery-BV59hSOR.js";import"./Tooltip-CWOPvmrv.js";import"./Popper-DcG5vPGv.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
