import{j as t}from"./iframe-D7tLk4ld.js";import{H as i}from"./Header-CoQKPWGL.js";import{P as a}from"./Page-B9irrruX.js";import{H as r}from"./HeaderLabel-NuCFaAEe.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BheNeVw7.js";import"./Box-BQ6FCTAV.js";import"./styled-C4zBw5eq.js";import"./Grid-DIKn7D0E.js";import"./Breadcrumbs-BbIC5Lcw.js";import"./index-B9sM2jn7.js";import"./Popover-9B-RCRNY.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./ListItem-bVDpz6Z-.js";import"./Link-B-Kks6_R.js";import"./lodash-Czox7iJy.js";import"./index-aaT1AT_u.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useApp-D_E3IHJo.js";import"./Page-CqghFNE1.js";import"./useMediaQuery-BP5kBs-k.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
