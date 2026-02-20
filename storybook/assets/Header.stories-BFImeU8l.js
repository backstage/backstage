import{j as t}from"./iframe-CXVefQjv.js";import{H as i}from"./Header-B2b8boLd.js";import{P as a}from"./Page-CA-duQyS.js";import{H as r}from"./HeaderLabel-BkKhS4Qd.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CNf04HDu.js";import"./makeStyles-cSB5pDml.js";import"./Box-D7AnzI4p.js";import"./styled-B7NpzSmh.js";import"./Grid-hBNd94kt.js";import"./Breadcrumbs-UB1ce_eO.js";import"./index-B9sM2jn7.js";import"./Popover-ByvpIW1H.js";import"./Modal-C62RgtH8.js";import"./Portal-BQuMmKqR.js";import"./List-S9fButJF.js";import"./ListContext-x0Xd6oQC.js";import"./ListItem-CB67RL_O.js";import"./Link-R8tlL6vJ.js";import"./index-CROf0-mb.js";import"./lodash-DZtYjLW6.js";import"./index-B97xvfin.js";import"./useAnalytics-Bx4_U39Z.js";import"./useApp-DMj12Ulj.js";import"./Page-DGJF8FNM.js";import"./useMediaQuery-CbRWZ-t3.js";import"./Tooltip-3hD40Mh0.js";import"./Popper-KPvihGZy.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
