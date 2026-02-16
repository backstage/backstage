import{j as t}from"./iframe-BtR5uFk3.js";import{H as i}from"./Header-C3iSLQgA.js";import{P as a}from"./Page-K5EVxaS3.js";import{H as r}from"./HeaderLabel-BBG4qxhc.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-fjm3U6tT.js";import"./makeStyles-BfJpy4Wy.js";import"./Box-OUxpV5ZT.js";import"./styled-Dh4-ZHyx.js";import"./Grid-BcwH-HFr.js";import"./Breadcrumbs-2ur0xsUx.js";import"./index-B9sM2jn7.js";import"./Popover-9Iv1wX11.js";import"./Modal-r2IX8849.js";import"./Portal-n2LDmCMW.js";import"./List-CzkDasS3.js";import"./ListContext-BRtoW0M1.js";import"./ListItem-CfCZyyBM.js";import"./Link-CiYTYpxs.js";import"./index-DxzcshiO.js";import"./lodash-ZuVUN9Fn.js";import"./index-BMej53MO.js";import"./useAnalytics-B6wKgkMO.js";import"./useApp-5tv6egRH.js";import"./Page-LDGytUon.js";import"./useMediaQuery-C2C2VCFU.js";import"./Tooltip-BsjCemVc.js";import"./Popper-BZySTT6t.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
