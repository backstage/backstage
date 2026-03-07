import{j as t}from"./iframe-B0Lf5NUM.js";import{H as i}from"./Header-CyH9zMtc.js";import{P as a}from"./Page-C2KSxs-z.js";import{H as r}from"./HeaderLabel-BbAbCiDr.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-xd2zg3In.js";import"./makeStyles-DeZCCiZz.js";import"./Box-aMxsL92-.js";import"./styled-DELPmjqg.js";import"./Grid-DX6cOXg5.js";import"./Breadcrumbs-DLBhwQqH.js";import"./index-B9sM2jn7.js";import"./Popover-D7BDCpOw.js";import"./Modal-Fw3H3BIv.js";import"./Portal-CFdZTsMU.js";import"./List-H_vSxU0X.js";import"./ListContext-71Kb5fnr.js";import"./ListItem-Cm0Qqfxw.js";import"./Link-wi1rFsNT.js";import"./index-D2K6ALme.js";import"./lodash-DH4atvbO.js";import"./index-DKt6U3gJ.js";import"./useAnalytics-CH2yDCbJ.js";import"./useApp-CqqROC9U.js";import"./Page-BOXNd3d8.js";import"./useMediaQuery-zHphFWN7.js";import"./Tooltip-BNHXTKw9.js";import"./Popper-Cw5KalTs.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
