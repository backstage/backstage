import{j as t}from"./iframe-Cih9KYts.js";import{H as i}from"./Header-Bl9bAup_.js";import{P as a}from"./Page-CUb5oXw7.js";import{H as r}from"./HeaderLabel-CFVR9w9_.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DSdGZgZY.js";import"./Box-5LOyitj9.js";import"./styled-VBtFtbNj.js";import"./Grid-CLRvRbDN.js";import"./Breadcrumbs-BineTX-8.js";import"./index-B9sM2jn7.js";import"./Popover-Dg3slux6.js";import"./Modal-BZoQWh9B.js";import"./Portal-DG1SCA6E.js";import"./List-DfB6hke5.js";import"./ListContext-DH23_8Wk.js";import"./ListItem-D5wUjexN.js";import"./Link-Ds2c62Jm.js";import"./lodash-Czox7iJy.js";import"./index-Bp0jFuCJ.js";import"./useAnalytics-Cmhz127l.js";import"./useApp-sV2xt9cM.js";import"./Page-CbgYX9Wj.js";import"./useMediaQuery-DCClq_xQ.js";import"./Tooltip-CgFVFwTk.js";import"./Popper-D0FUS77U.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
