import{j as t}from"./iframe-BOS9XsSt.js";import{H as i}from"./Header-Bm2N_-qb.js";import{P as a}from"./Page-BGqD3Nor.js";import{H as r}from"./HeaderLabel-Zh2IU4xu.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BUBAZPhm.js";import"./Box-BWfLAxjo.js";import"./styled-dnrl8B5-.js";import"./Grid-DpJzwvsy.js";import"./Breadcrumbs-C6Xb--pi.js";import"./index-B9sM2jn7.js";import"./Popover-BY21PHC9.js";import"./Modal-B4EjrvcH.js";import"./Portal-CERNgFq6.js";import"./List-BHDOi6uW.js";import"./ListContext-a1j27SdY.js";import"./ListItem-D4jOCDNX.js";import"./Link-B09CKdbR.js";import"./lodash-Czox7iJy.js";import"./index-BYPtPQ_E.js";import"./useAnalytics-Cu9Lzm5q.js";import"./useApp-D9_f5DFp.js";import"./Page-DmGrFsV3.js";import"./useMediaQuery-BNvouAY3.js";import"./Tooltip-CAWH6kC3.js";import"./Popper-B9Sqk4H1.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
