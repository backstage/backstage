import{j as t}from"./iframe-3r6KqT77.js";import{H as i}from"./Header-sPqMumBj.js";import{P as a}from"./Page-CS-KQPAf.js";import{H as r}from"./HeaderLabel-Df95ljZ9.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DY4D9_ks.js";import"./makeStyles-DdJxAtYT.js";import"./Box-COPBbbCD.js";import"./styled-DMrvUlKV.js";import"./Grid-BkUQ72Tl.js";import"./Breadcrumbs-CwTxIAlU.js";import"./index-B9sM2jn7.js";import"./Popover-Bw2lVm85.js";import"./Modal-BbNfWHh7.js";import"./Portal-bXQToQAq.js";import"./List-Q1xNDAi1.js";import"./ListContext-Bcxw2JhO.js";import"./ListItem-CAuAnmh9.js";import"./Link-Cai-SmHt.js";import"./index-Cl6LIb1L.js";import"./lodash-DWIaGFFw.js";import"./index-DPtf701Z.js";import"./useAnalytics-DIqfdXZ4.js";import"./useApp-BjW4qRdq.js";import"./Page-ChUgiEW2.js";import"./useMediaQuery-HVxCtZMt.js";import"./Tooltip-CG5wnqUK.js";import"./Popper-BlVfoq_o.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
