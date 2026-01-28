import{j as t}from"./iframe-DFdcbEiJ.js";import{H as i}from"./Header-B9Uap8Tj.js";import{P as a}from"./Page-DFPNiw3f.js";import{H as r}from"./HeaderLabel-Sg6t5ADu.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CTBofLn0.js";import"./Box-BjQGvIzi.js";import"./styled-DNdG2dK3.js";import"./Grid-Bz80tPVF.js";import"./Breadcrumbs-DVLfBsmQ.js";import"./index-B9sM2jn7.js";import"./Popover-Dn9yIWV_.js";import"./Modal-CT70aByk.js";import"./Portal-DjeB-iF_.js";import"./List-C-NEuts9.js";import"./ListContext-D0DH-Ku-.js";import"./ListItem-LVIqWJQW.js";import"./Link-Din0jYMc.js";import"./lodash-Czox7iJy.js";import"./index-CJ8jAIcI.js";import"./useAnalytics-CExwtm2Z.js";import"./useApp--XwcR16b.js";import"./Page-CXzpmwbi.js";import"./useMediaQuery-I3sssiq_.js";import"./Tooltip-D0BdWwmK.js";import"./Popper-zn-2LFE5.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
