import{j as t}from"./iframe-XFwexWAC.js";import{H as i}from"./Header-CdH8QEj2.js";import{P as a}from"./Page-DtSxUtg7.js";import{H as r}from"./HeaderLabel-DbHw_aRK.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DDpxLF7s.js";import"./Box-DOcmf_lA.js";import"./styled-CDWDroQT.js";import"./Grid-QGplJCTn.js";import"./Breadcrumbs-BS1eHM2t.js";import"./index-B9sM2jn7.js";import"./Popover-CVjrgcBr.js";import"./Modal-BKS56bVv.js";import"./Portal-DGqwvRCH.js";import"./List-cHbFQZE_.js";import"./ListContext-B0O1h7iD.js";import"./ListItem-BEnPhwl_.js";import"./Link-YMEncvsI.js";import"./lodash-DLuUt6m8.js";import"./index-BjVSwF8u.js";import"./useAnalytics-BpI3YstQ.js";import"./useApp-D2Je31QU.js";import"./Page-DHF212Z7.js";import"./useMediaQuery-DdhFJJvM.js";import"./Tooltip-pAeb8IBW.js";import"./Popper-Cpjma44V.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
