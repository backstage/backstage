import{j as t}from"./iframe-CmF8XmXW.js";import{H as i}from"./Header-C_qwFwUW.js";import{P as a}from"./Page-DLvZYogb.js";import{H as r}from"./HeaderLabel-znzd7QOT.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Fe4_D_KY.js";import"./makeStyles-Ibhc4-lx.js";import"./Box-D2-qDd5p.js";import"./styled-Cq2u0_JF.js";import"./Grid-DKauYoce.js";import"./Breadcrumbs-BMfYvFCH.js";import"./index-B9sM2jn7.js";import"./Popover-D8ZxMx0p.js";import"./Modal-DKAQifd-.js";import"./Portal-DLYTgwQk.js";import"./List-D_AhGxTu.js";import"./ListContext-CMFfQs0i.js";import"./ListItem-BaOpUjbT.js";import"./Link-DQbBb7hJ.js";import"./index-BiWnJDna.js";import"./lodash-BMfEwEVA.js";import"./index-llNJvO4J.js";import"./useAnalytics-BnM0MC_9.js";import"./useApp-DpGn1tXX.js";import"./Page-71tGcaNF.js";import"./useMediaQuery-DshIhQbB.js";import"./Tooltip-DhgmU7T0.js";import"./Popper-CVpB9i3l.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
