import{j as t}from"./iframe-Vo5gUnCl.js";import{H as i}from"./Header-CmhpjU_g.js";import{P as a}from"./Page-CKxFx0BT.js";import{H as r}from"./HeaderLabel-DKNAkb5F.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BUW_5xrU.js";import"./Box-DxK1aAZk.js";import"./styled-DKP2AsJk.js";import"./Grid-BEftOOde.js";import"./Breadcrumbs-CDbiLG3O.js";import"./index-B9sM2jn7.js";import"./Popover-S-Yp5OBg.js";import"./Modal-Ccymkcf6.js";import"./Portal-D4JBSn9P.js";import"./List-DaH1cfBf.js";import"./ListContext-CeAVa15U.js";import"./ListItem-C_bA5RtL.js";import"./Link-C_eXFj6m.js";import"./lodash-Czox7iJy.js";import"./index-CkzVBa0W.js";import"./useAnalytics-DHo0n9fb.js";import"./useApp-ByJEk4p0.js";import"./Page-HYVvTWMM.js";import"./useMediaQuery-CCtAi1l2.js";import"./Tooltip-CrljWSzR.js";import"./Popper-xVSLGgcC.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
