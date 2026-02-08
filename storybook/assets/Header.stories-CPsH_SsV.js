import{j as t}from"./iframe-BVVWNhNF.js";import{H as i}from"./Header-BoEBvRPz.js";import{P as a}from"./Page-jJf4FEo5.js";import{H as r}from"./HeaderLabel-jQs2oqcc.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CAzzI4Rw.js";import"./Box-I6qpNjup.js";import"./styled-BXlk9tEQ.js";import"./Grid-BhWDjvJh.js";import"./Breadcrumbs-B4K1if0a.js";import"./index-B9sM2jn7.js";import"./Popover-pnksybnm.js";import"./Modal-BSykfrg4.js";import"./Portal-DukR7Qds.js";import"./List-CeUn_h_G.js";import"./ListContext-D6HHPv4d.js";import"./ListItem-896bCnNz.js";import"./Link-C8sZRddr.js";import"./lodash-Czox7iJy.js";import"./index-Cytn1js_.js";import"./useAnalytics-DOlQNDHl.js";import"./useApp-CDZ4N_T1.js";import"./Page-CG1H592S.js";import"./useMediaQuery--G-u91BY.js";import"./Tooltip-B6-nubZA.js";import"./Popper-CpEGPy4_.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
