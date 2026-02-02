import{j as t}from"./iframe-DG9KPDCv.js";import{H as i}from"./Header-xEHQHG5K.js";import{P as a}from"./Page-LmsN77Jo.js";import{H as r}from"./HeaderLabel-B_8O-0Kb.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-vfDdZXJQ.js";import"./Box-CpNeY0Xu.js";import"./styled-B_dsPLrg.js";import"./Grid-BalTlFvh.js";import"./Breadcrumbs-CEBGBAhQ.js";import"./index-B9sM2jn7.js";import"./Popover-Ce3qAytM.js";import"./Modal-BgaFEzC9.js";import"./Portal-Du_aJAA6.js";import"./List-DESWnqW5.js";import"./ListContext-Cqq2xDze.js";import"./ListItem-CdFlW9lK.js";import"./Link-BeOk29Gb.js";import"./lodash-Czox7iJy.js";import"./index-Bi0fcTw3.js";import"./useAnalytics-DskDDOhn.js";import"./useApp-ijvxHEa-.js";import"./Page-j75FCGrN.js";import"./useMediaQuery-CPLarBt1.js";import"./Tooltip-DkJtZmcZ.js";import"./Popper-BuiKgC9z.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
