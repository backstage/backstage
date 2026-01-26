import{j as t}from"./iframe-CG856I7g.js";import{H as i}from"./Header-Chgai6U1.js";import{P as a}from"./Page-piOkdweA.js";import{H as r}from"./HeaderLabel-BuBBKDQL.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet--qGJkA3K.js";import"./Box-DirFOCIJ.js";import"./styled-8AOit3ty.js";import"./Grid-CG84KQIV.js";import"./Breadcrumbs-kb-rzM0h.js";import"./index-B9sM2jn7.js";import"./Popover-BVt04z7T.js";import"./Modal-odp3IgY3.js";import"./Portal-Bhu3uB1L.js";import"./List-BTwiC7G-.js";import"./ListContext-BzsI-cEV.js";import"./ListItem-BWUkcOJl.js";import"./Link-Cd9n886D.js";import"./lodash-Czox7iJy.js";import"./index-PWNHdhKk.js";import"./useAnalytics-D5P-YjA8.js";import"./useApp-CtCgKAFa.js";import"./Page-p6HQXNXi.js";import"./useMediaQuery-Dm2wfQ4r.js";import"./Tooltip-DTkgI76M.js";import"./Popper-BTDu7j3q.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
