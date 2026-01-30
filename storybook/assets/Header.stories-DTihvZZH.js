import{j as t}from"./iframe-q37i5wh7.js";import{H as i}from"./Header-MaxjbLGe.js";import{P as a}from"./Page-BhjIEovd.js";import{H as r}from"./HeaderLabel-BMYy8-sC.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-ND-OsSEV.js";import"./Box-COPOq1Uf.js";import"./styled-Cr1yRHHC.js";import"./Grid-C05v6eeb.js";import"./Breadcrumbs-CwPtRpgi.js";import"./index-B9sM2jn7.js";import"./Popover-CpvgzvTm.js";import"./Modal-TMOxKW-w.js";import"./Portal-Cg2yUny5.js";import"./List-PIZxoj_p.js";import"./ListContext-CjbrLwST.js";import"./ListItem-CpM31wZi.js";import"./Link-VlZlHdCt.js";import"./lodash-Czox7iJy.js";import"./index-4QSZcc7K.js";import"./useAnalytics-Qh0Z6cDc.js";import"./useApp-DRQlf20V.js";import"./Page-BRerolZJ.js";import"./useMediaQuery-Ds3LtY7a.js";import"./Tooltip-1ydGyrcT.js";import"./Popper-KbPRvRer.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
