import{j as t}from"./iframe-CJaWlx9k.js";import{H as i}from"./Header-BrGysVg6.js";import{P as a}from"./Page-SAHP2BU2.js";import{H as r}from"./HeaderLabel-CNxDgvcd.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CWBM4u8z.js";import"./Box-C7QC6pzn.js";import"./styled-CZ7JF9wM.js";import"./Grid-CvrlVjPi.js";import"./Breadcrumbs-Bpj2cGPc.js";import"./index-B9sM2jn7.js";import"./Popover-4AFqMLPU.js";import"./Modal-DA7gw75D.js";import"./Portal-CCaSbatU.js";import"./List-CG61H5Q6.js";import"./ListContext-BgC5EWvT.js";import"./ListItem-C89Oh5hh.js";import"./Link-BT9-PDsb.js";import"./lodash-Czox7iJy.js";import"./index-BQ0Bm2RY.js";import"./useAnalytics-B9VoDArS.js";import"./useApp-C3Rn7vNb.js";import"./Page-DgwF_mPY.js";import"./useMediaQuery-Boxbdgj3.js";import"./Tooltip-BdyP1fjK.js";import"./Popper-D3Zb46nS.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
