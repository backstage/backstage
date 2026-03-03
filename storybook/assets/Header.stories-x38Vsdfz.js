import{j as t}from"./iframe-BmigQEv-.js";import{H as i}from"./Header-CK3dANF5.js";import{P as a}from"./Page-ERXP9WQG.js";import{H as r}from"./HeaderLabel-u-xPVZrr.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DuppHcJm.js";import"./makeStyles-0-n1Rujo.js";import"./Box-YqGKr52F.js";import"./styled-DHllcCHM.js";import"./Grid-BZioZTwU.js";import"./Breadcrumbs-CkK6mqes.js";import"./index-B9sM2jn7.js";import"./Popover-CBw5Z0ap.js";import"./Modal-DG7NhvRI.js";import"./Portal-BhbQiPPq.js";import"./List-DPvCCYNu.js";import"./ListContext-DDrpeIYl.js";import"./ListItem-gIkgFmX0.js";import"./Link-zeLLiKoz.js";import"./index-MgZwvacw.js";import"./lodash-BZheRUGK.js";import"./index-BfwtKwvN.js";import"./useAnalytics-Cv3q-2FZ.js";import"./useApp-CTkrqPOE.js";import"./Page-CNQjK7NJ.js";import"./useMediaQuery-DXpfqfe1.js";import"./Tooltip-oWfERYB1.js";import"./Popper-B-YRGJsw.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
