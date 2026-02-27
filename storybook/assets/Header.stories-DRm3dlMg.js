import{j as t}from"./iframe-CAn0lpb7.js";import{H as i}from"./Header-DKLPoaN7.js";import{P as a}from"./Page-ASMj4d5l.js";import{H as r}from"./HeaderLabel-BcK3uX_t.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DFFj219Z.js";import"./makeStyles-DYHcJhPK.js";import"./Box-Bjf2DMwk.js";import"./styled-D2e0uBXe.js";import"./Grid-YTZOmRBF.js";import"./Breadcrumbs-Cj3kTxeV.js";import"./index-B9sM2jn7.js";import"./Popover-C55NQtKe.js";import"./Modal-C19m3_iM.js";import"./Portal-BzlmyQcI.js";import"./List-D_KByg89.js";import"./ListContext-CK2zO4S5.js";import"./ListItem-ri7MtAQ3.js";import"./Link-CDRYLymQ.js";import"./index-DUopTZr9.js";import"./lodash-BrFkqfO4.js";import"./index-DUzhWtMs.js";import"./useAnalytics-Bzn9D7Qs.js";import"./useApp-DuNmaME_.js";import"./Page-CIaIxrYu.js";import"./useMediaQuery-0wr5iEG9.js";import"./Tooltip-ofHGhymy.js";import"./Popper-CTfH6WVF.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
