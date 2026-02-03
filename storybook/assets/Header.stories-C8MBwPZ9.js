import{j as t}from"./iframe-CqNqnb74.js";import{H as i}from"./Header-BzzGua4S.js";import{P as a}from"./Page-CNZ4fsiG.js";import{H as r}from"./HeaderLabel-Dkou_EG4.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-N8vAhXJ9.js";import"./Box-BOvD5Bg7.js";import"./styled-_PBYdDbi.js";import"./Grid-Caq84KkR.js";import"./Breadcrumbs-BEUS1HyA.js";import"./index-B9sM2jn7.js";import"./Popover-B5zxDxZ5.js";import"./Modal-DG_DwVZd.js";import"./Portal-Czxz0PR0.js";import"./List-aEU9IVP1.js";import"./ListContext-D4KOPpIf.js";import"./ListItem-CO20Ch0Y.js";import"./Link-CAxa2nmx.js";import"./lodash-Czox7iJy.js";import"./index-CfXjUdjY.js";import"./useAnalytics-BT9M_UlL.js";import"./useApp-IKd96EAr.js";import"./Page-CA2E0pO2.js";import"./useMediaQuery-CWqszbU7.js";import"./Tooltip-DFfl-fad.js";import"./Popper-C4CcENfH.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
