import{j as t}from"./iframe-Yl0Qc67S.js";import{H as i}from"./Header-FW1do0Ki.js";import{P as a}from"./Page-CMZJftue.js";import{H as r}from"./HeaderLabel-Bo2scTk_.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-c3ZpJU0I.js";import"./Box-DltD7D0m.js";import"./styled-DXbACUbA.js";import"./Grid-BoLsaJTc.js";import"./Breadcrumbs-DyDMah71.js";import"./index-B9sM2jn7.js";import"./Popover-CGGMzivv.js";import"./Modal-iRV6ko-2.js";import"./Portal-kuGKvNyC.js";import"./List-C5jB0ILm.js";import"./ListContext-BQmyr3YY.js";import"./ListItem-BafF8VBM.js";import"./Link-_9kMa81h.js";import"./lodash-DLuUt6m8.js";import"./index-CuRibKaG.js";import"./useAnalytics-De1GIX-U.js";import"./useApp-5HecZ9VC.js";import"./Page-BnwCne9q.js";import"./useMediaQuery-Cyh9vow2.js";import"./Tooltip-N5ZLqhtT.js";import"./Popper-90U13irg.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
